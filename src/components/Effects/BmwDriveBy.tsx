"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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
                <Image
                    src="/custom_paint_frontAngle.webp"
                    alt=""
                    width={1000}
                    height={400}
                    className="bmw-car"
                    priority
                />
            </div>
        </div>
    );
}
