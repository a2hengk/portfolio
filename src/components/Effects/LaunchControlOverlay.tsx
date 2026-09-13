"use client";

import { useEffect, useState } from "react";

// Header logo easter egg: 5 quick clicks on the brand dispatch "bmw-launch",
// which this overlay turns into a brief full-viewport HUD flash and also
// replays the hero's BMW drive-by for good measure.
export default function LaunchControlOverlay() {
    const [active, setActive] = useState(false);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout> | undefined;

        const onLaunch = () => {
            setActive(true);
            window.dispatchEvent(new Event("bmw-driveby"));
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => setActive(false), 2200);
        };

        window.addEventListener("bmw-launch", onLaunch);

        return () => {
            window.removeEventListener("bmw-launch", onLaunch);
            if (timer) clearTimeout(timer);
        };
    }, []);

    if (!active) {
        return null;
    }

    return (
        <div className="launch-control" role="status" aria-live="polite">
            <div className="launch-control__flash" aria-hidden="true" />
            <p className="launch-control__text glitch" data-text="Launch control engaged">
                Launch control engaged
            </p>
            <div className="launch-control__bar" aria-hidden="true">
                <div className="launch-control__bar-fill" />
            </div>
        </div>
    );
}
