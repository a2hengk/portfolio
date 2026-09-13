"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// The secret: enter the Konami code anywhere on the site (no text inputs
// exist here, so a bare keydown listener is safe) to unlock a tiny canvas
// lane-dodge race against rival cars. Purely a for-fun easter egg - it
// doesn't touch scoring/analytics/anything real.
const KONAMI_SEQUENCE = [
    "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
    "b", "a",
];

const LANES = 3;
const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 440;
const LANE_WIDTH = CANVAS_WIDTH / LANES;
const BEST_SCORE_KEY = "bmw-race-best";

interface Obstacle {
    lane: number;
    y: number;
}

export default function SecretRaceGame() {
    const [open, setOpen] = useState(false);
    const [score, setScore] = useState(0);
    const [best, setBest] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [running, setRunning] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const progressRef = useRef(0);
    const laneRef = useRef(1);
    const obstaclesRef = useRef<Obstacle[]>([]);
    const speedRef = useRef(2.6);
    const scoreRef = useRef(0);
    const runningRef = useRef(false);
    const rafRef = useRef(0);
    const lastSpawnRef = useRef(0);

    // Global Konami-code listener - always active, independent of whether
    // the overlay is currently open.
    useEffect(() => {
        let position = 0;

        const onKeyDown = (event: KeyboardEvent) => {
            const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
            const expected = KONAMI_SEQUENCE[position];

            if (key === expected) {
                position += 1;
                if (position === KONAMI_SEQUENCE.length) {
                    position = 0;
                    setOpen(true);
                }
            } else {
                position = key === KONAMI_SEQUENCE[0] ? 1 : 0;
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    useEffect(() => {
        try {
            const stored = window.localStorage.getItem(BEST_SCORE_KEY);
            if (stored) setBest(Number(stored));
        } catch {
            // localStorage unavailable (private mode etc.) - not worth surfacing.
        }
    }, []);

    const draw = useCallback(() => {
        const ctx = canvasRef.current?.getContext("2d");
        if (!ctx) return;

        ctx.fillStyle = "#060a12";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.strokeStyle = "rgba(0, 231, 255, 0.25)";
        ctx.lineWidth = 2;
        ctx.setLineDash([14, 16]);
        ctx.lineDashOffset = -(progressRef.current % 30);
        for (let i = 1; i < LANES; i += 1) {
            ctx.beginPath();
            ctx.moveTo(i * LANE_WIDTH, 0);
            ctx.lineTo(i * LANE_WIDTH, CANVAS_HEIGHT);
            ctx.stroke();
        }
        ctx.setLineDash([]);

        obstaclesRef.current.forEach((obstacle) => {
            const x = obstacle.lane * LANE_WIDTH + LANE_WIDTH / 2;
            ctx.save();
            ctx.shadowColor = "rgba(224, 51, 63, 0.7)";
            ctx.shadowBlur = 12;
            ctx.fillStyle = "#e0333f";
            ctx.fillRect(x - 22, obstacle.y - 34, 44, 60);
            ctx.restore();
        });

        const px = laneRef.current * LANE_WIDTH + LANE_WIDTH / 2;
        ctx.save();
        ctx.shadowColor = "rgba(0, 231, 255, 0.8)";
        ctx.shadowBlur = 16;
        ctx.fillStyle = "#3f8ce8";
        ctx.fillRect(px - 22, CANVAS_HEIGHT - 90, 44, 60);
        ctx.fillStyle = "#f4f0e8";
        ctx.fillRect(px - 22, CANVAS_HEIGHT - 66, 44, 8);
        ctx.restore();
    }, []);

    const stopGame = useCallback(() => {
        runningRef.current = false;
        setRunning(false);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }, []);

    const loop = useCallback((time: number) => {
        if (!runningRef.current) return;

        progressRef.current += speedRef.current;
        speedRef.current = Math.min(speedRef.current + 0.0018, 7);
        scoreRef.current += 1;
        setScore(Math.floor(scoreRef.current / 6));

        if (time - lastSpawnRef.current > Math.max(650, 1000 - speedRef.current * 60)) {
            lastSpawnRef.current = time;
            obstaclesRef.current.push({ lane: Math.floor(Math.random() * LANES), y: -60 });
        }

        obstaclesRef.current = obstaclesRef.current
            .map((obstacle) => ({ ...obstacle, y: obstacle.y + speedRef.current * 2 }))
            .filter((obstacle) => obstacle.y < CANVAS_HEIGHT + 80);

        const collision = obstaclesRef.current.some(
            (obstacle) =>
                obstacle.lane === laneRef.current &&
                obstacle.y > CANVAS_HEIGHT - 110 &&
                obstacle.y < CANVAS_HEIGHT - 20
        );

        if (collision) {
            runningRef.current = false;
            setRunning(false);
            setGameOver(true);
            const finalScore = Math.floor(scoreRef.current / 6);
            setBest((current) => {
                const next = Math.max(current, finalScore);
                try {
                    window.localStorage.setItem(BEST_SCORE_KEY, String(next));
                } catch {
                    // ignore
                }
                return next;
            });
            draw();
            return;
        }

        draw();
        rafRef.current = requestAnimationFrame(loop);
    }, [draw]);

    const startGame = useCallback(() => {
        laneRef.current = 1;
        obstaclesRef.current = [];
        speedRef.current = 2.6;
        scoreRef.current = 0;
        lastSpawnRef.current = 0;
        setScore(0);
        setGameOver(false);
        runningRef.current = true;
        setRunning(true);
        rafRef.current = requestAnimationFrame(loop);
    }, [loop]);

    // Controls + Escape-to-close while the overlay is open.
    useEffect(() => {
        if (!open) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false);
                stopGame();
                return;
            }

            if (!runningRef.current) {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    startGame();
                }
                return;
            }

            if (event.key === "ArrowLeft" || event.key === "a") {
                event.preventDefault();
                laneRef.current = Math.max(0, laneRef.current - 1);
            } else if (event.key === "ArrowRight" || event.key === "d") {
                event.preventDefault();
                laneRef.current = Math.min(LANES - 1, laneRef.current + 1);
            } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                event.preventDefault();
            }
        };

        window.addEventListener("keydown", onKeyDown);
        draw();

        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, startGame, stopGame, draw]);

    useEffect(() => stopGame, [stopGame]);

    if (!open) {
        return null;
    }

    return (
        <div className="race-overlay" role="dialog" aria-modal="true" aria-label="Secret BMW dash race">
            <div className="race-modal">
                <span className="hud-corner hud-corner--tl" aria-hidden="true" />
                <span className="hud-corner hud-corner--tr" aria-hidden="true" />
                <span className="hud-corner hud-corner--bl" aria-hidden="true" />
                <span className="hud-corner hud-corner--br" aria-hidden="true" />

                <div className="race-modal__top">
                    <p className="race-modal__title neon-text">// secret sector unlocked</p>
                    <button
                        type="button"
                        className="race-modal__close"
                        onClick={() => {
                            setOpen(false);
                            stopGame();
                        }}
                    >
                        Close [Esc]
                    </button>
                </div>

                <div className="race-modal__hud">
                    <span>Score <strong>{score}</strong></span>
                    <span>Best <strong>{best}</strong></span>
                </div>

                <canvas
                    ref={canvasRef}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    className="race-canvas"
                    aria-hidden="true"
                />

                {!running ? (
                    <div className="race-modal__prompt">
                        <p>{gameOver ? `Crashed. Score ${score}.` : "Dodge the rivals. ← → to steer."}</p>
                        <button type="button" className="race-modal__start" onClick={startGame}>
                            {gameOver ? "Retry" : "Start engine"}
                        </button>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
