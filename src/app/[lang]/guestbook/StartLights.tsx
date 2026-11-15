"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type PointerEvent } from "react";
import { startRun, submitTime } from "@/app/[lang]/guestbook/reaction-actions";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { fill } from "@/i18n/config";
import type { LeaderboardEntry } from "@/lib/reaction-leaderboard";
import styles from "./pitwall.module.css";
import {
    FIRST_LIGHT_DELAY_MS,
    HOLD_MAX_MS,
    HOLD_MIN_MS,
    LEADERBOARD_SIZE,
    LIGHT_COUNT,
    LIGHT_INTERVAL_MS,
    LIGHTS_SEQUENCE_MS,
    MAX_SAVED_REACTION_MS,
    MIN_REACTION_MS,
    PLAYER_NAME_MAX_LENGTH,
} from "@/lib/reaction-constants";

// F1-style start: five red lights come on one per second, hold for a random
// moment, then go green. Time from green to the first press is the score.
//
// Timing notes:
// - The press is read from pointerdown/keydown (not click, which waits for
//   release) and uses event.timeStamp, the moment the browser received the
//   input, not when our handler got around to running.
// - Green is switched straight on the DOM inside requestAnimationFrame and
//   timestamped there, so React's render isn't part of the measured time.
//   What's left is the display's own latency (about one frame), the same
//   for everybody on the same screen.

type Phase = "idle" | "arming" | "lights" | "green" | "result" | "jumpstart";

type SaveState =
    | { status: "idle" }
    | { status: "saving" }
    | { status: "saved"; message: string }
    | { status: "error"; message: string };

const BEST_STORAGE_KEY = "start-lights-best";
const NAME_STORAGE_KEY = "start-lights-name";
// If the server doesn't answer within this, the run goes ahead unranked.
const TOKEN_TIMEOUT_MS = 2000;
// Same src as the guestbook so next/script loads it only once per session.
const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";

function readStorage(key: string): string | null {
    try {
        return window.localStorage.getItem(key);
    } catch {
        return null;
    }
}

function writeStorage(key: string, value: string) {
    try {
        window.localStorage.setItem(key, value);
    } catch {
        // private mode etc. - personal best just won't stick
    }
}

function formatSeconds(ms: number): string {
    return (ms / 1000).toFixed(3);
}

function nameKey(value: string): string {
    return value.normalize("NFKC").trim().replace(/\s+/g, " ").toLowerCase();
}

export default function StartLights({
    initialLeaderboard,
    dict,
}: {
    initialLeaderboard: LeaderboardEntry[];
    dict: Dictionary["guestbook"]["startLights"];
}) {
    const [phase, setPhase] = useState<Phase>("idle");
    const [litCount, setLitCount] = useState(0);
    const [reactionMs, setReactionMs] = useState<number | null>(null);
    const [jumpReason, setJumpReason] = useState<"early" | "anticipated">("early");
    const [ranked, setRanked] = useState(false);
    const [best, setBest] = useState<number | null>(null);
    const [leaderboard, setLeaderboard] = useState(initialLeaderboard);
    const [name, setName] = useState("");
    const [saveState, setSaveState] = useState<SaveState>({ status: "idle" });
    const [highlightKey, setHighlightKey] = useState<string | null>(null);
    const [turnstileReady, setTurnstileReady] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState("");

    const gantryRef = useRef<HTMLDivElement>(null);
    const padRef = useRef<HTMLButtonElement>(null);
    const turnstileContainerRef = useRef<HTMLDivElement>(null);
    const timersRef = useRef<number[]>([]);
    const runIdRef = useRef(0);
    const phaseRef = useRef<Phase>("idle");
    const greenAtRef = useRef(0);
    const runTokenRef = useRef<string | null>(null);

    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

    const go = useCallback((next: Phase) => {
        phaseRef.current = next;
        setPhase(next);
    }, []);

    const clearTimers = useCallback(() => {
        timersRef.current.forEach((id) => window.clearTimeout(id));
        timersRef.current = [];
    }, []);

    const schedule = useCallback((fn: () => void, ms: number) => {
        timersRef.current.push(window.setTimeout(fn, ms));
    }, []);

    useEffect(() => {
        const storedBest = Number(readStorage(BEST_STORAGE_KEY));
        if (storedBest > 0) setBest(storedBest);
        const storedName = readStorage(NAME_STORAGE_KEY);
        if (storedName) setName(storedName);
        return clearTimers;
    }, [clearTimers]);

    const startSequence = useCallback(() => {
        clearTimers();
        const runId = ++runIdRef.current;
        runTokenRef.current = null;
        setReactionMs(null);
        setLitCount(0);
        setRanked(false);
        setSaveState({ status: "idle" });
        setHighlightKey(null);
        go("arming");

        const tokenRequest = startRun().catch(() => null);
        const timeout = new Promise<null>((resolve) => schedule(() => resolve(null), TOKEN_TIMEOUT_MS));

        void Promise.race([tokenRequest, timeout]).then((result) => {
            if (runIdRef.current !== runId || phaseRef.current !== "arming") return;

            let holdMs: number;
            if (result && "token" in result) {
                runTokenRef.current = result.token;
                holdMs = result.holdMs;
                setRanked(true);
            } else {
                holdMs = HOLD_MIN_MS + Math.random() * (HOLD_MAX_MS - HOLD_MIN_MS);
            }

            go("lights");

            for (let i = 0; i < LIGHT_COUNT; i += 1) {
                schedule(() => setLitCount(i + 1), FIRST_LIGHT_DELAY_MS + i * LIGHT_INTERVAL_MS);
            }

            schedule(() => {
                requestAnimationFrame(() => {
                    if (runIdRef.current !== runId || phaseRef.current !== "lights") return;
                    gantryRef.current?.setAttribute("data-phase", "green");
                    padRef.current?.setAttribute("data-phase", "green");
                    greenAtRef.current = performance.now();
                    go("green");
                });
            }, LIGHTS_SEQUENCE_MS + holdMs);
        });
    }, [clearTimers, go, schedule]);

    const handlePress = useCallback(
        (timeStamp: number) => {
            const current = phaseRef.current;

            if (current === "idle" || current === "result" || current === "jumpstart") {
                startSequence();
                return;
            }

            if (current === "arming" || current === "lights") {
                clearTimers();
                runIdRef.current += 1;
                setJumpReason("early");
                go("jumpstart");
                return;
            }

            // green
            const measured = Math.round(timeStamp - greenAtRef.current);
            if (measured < MIN_REACTION_MS) {
                setJumpReason("anticipated");
                go("jumpstart");
                return;
            }

            setReactionMs(measured);
            go("result");
            setBest((previous) => {
                if (previous !== null && previous <= measured) return previous;
                writeStorage(BEST_STORAGE_KEY, String(measured));
                return measured;
            });
        },
        [clearTimers, go, startSequence],
    );

    const onPointerDown = (event: PointerEvent<HTMLElement>) => {
        if (!event.isPrimary || event.button !== 0) return;
        // preventDefault also cancels the browser's focus-on-mousedown, so
        // focus the pad by hand - after one click, Space keeps working too.
        event.preventDefault();
        padRef.current?.focus({ preventScroll: true });
        handlePress(event.timeStamp);
    };

    const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
        if (event.key !== " " && event.key !== "Enter") return;
        // Also stops the button's own click, so one press = one input.
        event.preventDefault();
        if (event.repeat) return;
        handlePress(event.timeStamp);
    };

    const lastOnBoard = leaderboard[leaderboard.length - 1];
    const qualifies =
        phase === "result" &&
        ranked &&
        reactionMs !== null &&
        reactionMs <= MAX_SAVED_REACTION_MS &&
        (leaderboard.length < LEADERBOARD_SIZE || (lastOnBoard !== undefined && reactionMs < lastOnBoard.reactionMs));
    const showSaveForm = qualifies && saveState.status !== "saved";

    // Turnstile only appears once a time is worth saving, so it's rendered
    // explicitly instead of via the auto-scanned .cf-turnstile class.
    useEffect(() => {
        const container = turnstileContainerRef.current;
        if (!showSaveForm || !turnstileReady || !siteKey || !container || !window.turnstile) return;

        const widgetId = window.turnstile.render(container, {
            sitekey: siteKey,
            theme: "dark",
            callback: (token) => setTurnstileToken(token),
            "expired-callback": () => setTurnstileToken(""),
            "error-callback": () => setTurnstileToken(""),
        });

        return () => {
            if (widgetId) window.turnstile?.remove(widgetId);
            setTurnstileToken("");
        };
    }, [showSaveForm, turnstileReady, siteKey]);

    const onSave = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const token = runTokenRef.current;
        if (!token || reactionMs === null) return;

        setSaveState({ status: "saving" });
        const result = await submitTime({ token, reactionMs, name, turnstileToken });

        if (!result.ok) {
            // The action returns an error key; translate it here.
            const message = (dict.errors as Record<string, string>)[result.error] ?? dict.errors.invalid;
            setSaveState({ status: "error", message });
            window.turnstile?.reset();
            setTurnstileToken("");
            return;
        }

        writeStorage(NAME_STORAGE_KEY, name.trim());
        setLeaderboard(result.leaderboard);
        setHighlightKey(nameKey(name));
        setSaveState({
            status: "saved",
            message: result.improved ? dict.savedImproved : dict.savedSlower,
        });
    };

    // The pad is the obvious "press here" target - most people won't read a
    // hint below the lights or guess that the lights themselves are clickable.
    const pad = (() => {
        switch (phase) {
            case "idle":
                return { title: dict.pad.idleTitle, sub: dict.pad.idleSub };
            case "arming":
            case "lights":
                return { title: dict.pad.waitTitle, sub: fill(dict.pad.waitSub, { lit: litCount, total: LIGHT_COUNT }) };
            case "green":
                return { title: dict.pad.goTitle, sub: dict.pad.goSub };
            case "jumpstart":
                return {
                    title: dict.pad.jumpTitle,
                    sub:
                        jumpReason === "early"
                            ? dict.pad.jumpEarly
                            : fill(dict.pad.jumpAnticipated, { min: MIN_REACTION_MS }),
                };
            case "result":
                return {
                    title: `${formatSeconds(reactionMs ?? 0)} s`,
                    sub: ranked ? dict.pad.again : dict.pad.unranked,
                };
        }
    })();

    return (
        <section className={`glass ld ${styles.panel} ${styles.lights}`} aria-labelledby="start-lights-title" style={{ animationDelay: "0.45s" }}>
            <Script src={TURNSTILE_SRC} strategy="afterInteractive" onReady={() => setTurnstileReady(true)} />

            <div className={styles.panelHead}>
                <h2 id="start-lights-title">{dict.title}</h2>
                <p className="mut">{dict.text}</p>
            </div>

            {/* Decorative but still clickable for people who do go for the
                lights - the pad below is the real (focusable) control. */}
            <div ref={gantryRef} className={styles.gantry} data-phase={phase} onPointerDown={onPointerDown} aria-hidden="true">
                {Array.from({ length: LIGHT_COUNT }, (_, index) => (
                    <span key={index} className={`${styles.lamp} ${phase === "lights" && litCount > index ? styles.lit : ""}`} />
                ))}
            </div>

            <button
                ref={padRef}
                type="button"
                className={styles.pad}
                data-phase={phase}
                onPointerDown={onPointerDown}
                onKeyDown={onKeyDown}
            >
                <span className={`disp ${styles.padTitle}`} aria-live="polite">
                    {phase === "idle" ? (
                        <>
                            <span className={styles.verbClick}>{dict.clickHere}</span>
                            <span className={styles.verbTap}>{dict.tapHere}</span>
                            {pad.title}
                        </>
                    ) : (
                        pad.title
                    )}
                </span>
                <span className={styles.padSub}>{pad.sub}</span>
            </button>

            {showSaveForm ? (
                <form className={styles.save} onSubmit={onSave}>
                    <p className={styles.saveTitle}>{fill(dict.saveTitle, { size: LEADERBOARD_SIZE })}</p>
                    <div className={styles.saveRow}>
                        <div className={styles.field}>
                            <label htmlFor="start-lights-name">{dict.nameLabel}</label>
                            <input
                                id="start-lights-name"
                                className={styles.input}
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                maxLength={PLAYER_NAME_MAX_LENGTH}
                                placeholder={dict.namePlaceholder}
                                autoComplete="nickname"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-w"
                            disabled={saveState.status === "saving" || (Boolean(siteKey) && !turnstileToken)}
                        >
                            {saveState.status === "saving" ? dict.saving : dict.save}
                        </button>
                    </div>
                    {siteKey ? <div ref={turnstileContainerRef} className={styles.turnstile} /> : null}
                    {saveState.status === "error" ? (
                        <p className={styles.error} role="alert">
                            {saveState.message}
                        </p>
                    ) : null}
                </form>
            ) : null}

            {saveState.status === "saved" ? (
                <p className={styles.success} role="status">
                    {saveState.message}
                </p>
            ) : null}

            <div className={styles.board}>
                <div className={styles.boardHead}>
                    <h3>{fill(dict.boardTitle, { size: LEADERBOARD_SIZE })}</h3>
                    <span className="mut">
                        {dict.yourBest}: <strong>{best !== null ? `${formatSeconds(best)} s` : dict.noBest}</strong>
                    </span>
                </div>

                {leaderboard.length === 0 ? (
                    <p className={`mut ${styles.boardEmpty}`}>{dict.emptyBoard}</p>
                ) : (
                    <ol className={styles.boardList}>
                        {leaderboard.map((entry, index) => (
                            <li
                                key={entry.id}
                                className={`${styles.boardRow} ${nameKey(entry.displayName) === highlightKey ? styles.you : ""}`}
                            >
                                <span className="disp">P{index + 1}</span>
                                <span className={styles.boardName}>{entry.displayName}</span>
                                <span>{formatSeconds(entry.reactionMs)} s</span>
                            </li>
                        ))}
                    </ol>
                )}
            </div>
        </section>
    );
}
