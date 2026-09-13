"use client";

import { useEffect, useState } from "react";

// Small stylized BMW silhouette in the Motorsport tricolor, used as the
// ambient "drive-by" animation and reused by the launch-control easter egg.
function BmwSilhouette() {
    return (
        <svg viewBox="0 0 200 70" className="bmw-car" aria-hidden="true">
            <defs>
                <linearGradient id="bmwBody" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1c4470" />
                    <stop offset="100%" stopColor="#0c1c30" />
                </linearGradient>
            </defs>
            <path
                d="M10 52 C 8 40, 20 34, 34 33 L 52 20 C 62 14, 96 12, 118 16 L 150 24 C 168 27, 186 32, 192 42 C 194 48, 190 53, 182 53 L 170 53 C 168 44, 160 38, 151 38 C 142 38, 134 44, 132 53 L 70 53 C 68 44, 60 38, 51 38 C 42 38, 34 44, 32 53 L 18 53 C 12 53, 10 52, 10 52 Z"
                fill="url(#bmwBody)"
                stroke="var(--neon-cyan)"
                strokeWidth="1.4"
            />
            <path d="M56 20 L 70 21 L 78 33 L 48 33 Z" fill="#0b1622" opacity="0.9" />
            <g transform="skewX(-20)">
                <rect x="34" y="26" width="60" height="3" fill="var(--accent)" />
                <rect x="34" y="30" width="60" height="2.4" fill="var(--text)" />
                <rect x="34" y="34" width="60" height="2.4" fill="var(--m-red)" />
            </g>
            <circle cx="51" cy="53" r="11" fill="#05070a" stroke="var(--neon-cyan)" strokeWidth="1.6" />
            <circle cx="151" cy="53" r="11" fill="#05070a" stroke="var(--neon-cyan)" strokeWidth="1.6" />
            <circle cx="51" cy="53" r="4" fill="var(--neon-cyan)" opacity="0.6" />
            <circle cx="151" cy="53" r="4" fill="var(--neon-cyan)" opacity="0.6" />
            <circle cx="188" cy="40" r="3" fill="var(--neon-cyan)" />
        </svg>
    );
}

// Plays once shortly after the hero mounts, then again any time a
// "bmw-driveby" event fires (the header logo easter egg dispatches one).
// Remounting the inner element via `key` restarts the CSS animation.
export default function BmwDriveBy() {
    const [runId, setRunId] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setRunId((n) => n + 1), 1800);
        const replay = () => setRunId((n) => n + 1);

        window.addEventListener("bmw-driveby", replay);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("bmw-driveby", replay);
        };
    }, []);

    if (!runId) {
        return null;
    }

    return (
        <div className="bmw-driveby-track" aria-hidden="true">
            <div key={runId} className="bmw-driveby">
                <div className="bmw-driveby__trail" />
                <BmwSilhouette />
            </div>
        </div>
    );
}
