"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type PointerEvent } from "react";
import { startRun, submitTime } from "@/app/off-duty/actions";
import type { LeaderboardEntry } from "@/lib/reaction-leaderboard";
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

export default function StartLights({ initialLeaderboard }: { initialLeaderboard: LeaderboardEntry[] }) {
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

    const gantryRef = useRef<HTMLButtonElement>(null);
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

    const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
        if (!event.isPrimary || event.button !== 0) return;
        event.preventDefault();
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
            setSaveState({ status: "error", message: result.error });
            window.turnstile?.reset();
            setTurnstileToken("");
            return;
        }

        writeStorage(NAME_STORAGE_KEY, name.trim());
        setLeaderboard(result.leaderboard);
        setHighlightKey(nameKey(name));
        setSaveState({
            status: "saved",
            message: result.improved
                ? "Saved - you're on the board."
                : "That name already has a faster time saved, so that one stays.",
        });
    };

    const readout = (() => {
        switch (phase) {
            case "idle":
                return { label: "Ready", value: "Hit the lights", tone: "idle" };
            case "arming":
            case "lights":
                return { label: "Lights", value: `${litCount} / ${LIGHT_COUNT}`, tone: "idle" };
            case "green":
                return { label: "Go", value: "GO GO GO", tone: "green" };
            case "jumpstart":
                return {
                    label: jumpReason === "early" ? "Jump start" : "Too quick to be real",
                    value: "+5s penalty",
                    tone: "red",
                };
            case "result":
                return { label: "Reaction", value: `${formatSeconds(reactionMs ?? 0)} s`, tone: "green" };
        }
    })();

    const hint =
        phase === "idle"
            ? "Click, tap or press Space on the lights to start. Hit it again the moment they turn green."
            : phase === "jumpstart"
              ? jumpReason === "early"
                  ? "You went before green. Click to line up again."
                  : `Under ${MIN_REACTION_MS} ms counts as guessing, not reacting. Click to try again.`
              : phase === "result"
                ? ranked
                    ? "Click the lights for another go."
                    : "Leaderboard couldn't be reached, so this run was just for fun. Click to go again."
                : "Wait for green...";

    return (
        <section className="route-section start-lights" id="start-lights">
            <Script src={TURNSTILE_SRC} strategy="afterInteractive" onReady={() => setTurnstileReady(true)} />

            <div className="section__heading">
                <div className="section-marker">
                    <span className="sector-tag">Grid</span>
                    <p className="eyebrow">Lights out</p>
                </div>
                <h2>How fast are you off the line?</h2>
                <p>
                    Five reds, a random hold, then green. Your time is from green to your click - go early and
                    it&apos;s a jump start.
                </p>
            </div>

            <div className="start-lights__layout">
                <div className="start-lights__stage">
                    <button
                        ref={gantryRef}
                        type="button"
                        className="start-lights__gantry"
                        data-phase={phase}
                        onPointerDown={onPointerDown}
                        onKeyDown={onKeyDown}
                        aria-describedby="start-lights-hint"
                        aria-label="Start lights - press to start, then press again on green"
                    >
                        {Array.from({ length: LIGHT_COUNT }, (_, index) => (
                            <span
                                key={index}
                                className={`start-lights__pod${phase === "lights" && litCount > index ? " is-lit" : ""}`}
                                aria-hidden="true"
                            >
                                <span className="start-lights__lamp" />
                                <span className="start-lights__lamp" />
                            </span>
                        ))}
                    </button>

                    <div className={`start-lights__readout start-lights__readout--${readout.tone}`} aria-live="polite">
                        <span className="start-lights__readout-label">{readout.label}</span>
                        <strong className="start-lights__readout-value">{readout.value}</strong>
                    </div>

                    <p id="start-lights-hint" className="start-lights__hint">
                        {hint}
                    </p>

                    {showSaveForm ? (
                        <form className="start-lights__save" onSubmit={onSave}>
                            <p className="start-lights__save-title">That&apos;s a top {LEADERBOARD_SIZE} time. Put your name on it?</p>
                            <div className="start-lights__save-row">
                                <label htmlFor="start-lights-name" className="visually-hidden">
                                    Name
                                </label>
                                <input
                                    id="start-lights-name"
                                    className="guestbook-input"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    maxLength={PLAYER_NAME_MAX_LENGTH}
                                    placeholder="Driver name"
                                    autoComplete="nickname"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="guestbook-form__submit"
                                    disabled={saveState.status === "saving" || (Boolean(siteKey) && !turnstileToken)}
                                >
                                    {saveState.status === "saving" ? "Saving..." : "Save time"}
                                </button>
                            </div>
                            {siteKey ? <div ref={turnstileContainerRef} className="start-lights__turnstile" /> : null}
                            {saveState.status === "error" ? (
                                <p className="guestbook-form__error">{saveState.message}</p>
                            ) : null}
                        </form>
                    ) : null}

                    {saveState.status === "saved" ? (
                        <p className="guestbook-form__success">{saveState.message}</p>
                    ) : null}
                </div>

                <aside className="start-lights__board" aria-labelledby="start-lights-board-title">
                    <div className="start-lights__board-head">
                        <h3 id="start-lights-board-title">Top {LEADERBOARD_SIZE}</h3>
                        <span className="start-lights__best">
                            Your best <strong>{best !== null ? `${formatSeconds(best)} s` : "--"}</strong>
                        </span>
                    </div>

                    {leaderboard.length === 0 ? (
                        <p className="guestbook-empty">Grid&apos;s empty - first clean start takes P1.</p>
                    ) : (
                        <ol className="start-lights__list">
                            {leaderboard.map((entry, index) => (
                                <li
                                    key={entry.id}
                                    className={`start-lights__row${nameKey(entry.displayName) === highlightKey ? " is-you" : ""}`}
                                >
                                    <span className="start-lights__pos">P{index + 1}</span>
                                    <span className="start-lights__name">{entry.displayName}</span>
                                    <span className="start-lights__time">{formatSeconds(entry.reactionMs)}</span>
                                </li>
                            ))}
                        </ol>
                    )}
                </aside>
            </div>
        </section>
    );
}
