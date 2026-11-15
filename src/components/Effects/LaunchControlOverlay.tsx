"use client";

import { useEffect, useState } from "react";
import styles from "./Effects.module.css";

// Nav logo easter egg: 5 quick clicks on the brand dispatch "bmw-launch",
// which this overlay turns into a brief full-viewport flash.
export default function LaunchControlOverlay() {
    const [active, setActive] = useState(false);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout> | undefined;

        const onLaunch = () => {
            setActive(true);
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
        <div className={styles.launch} role="status" aria-live="polite">
            <div className={styles.flash} aria-hidden="true" />
            <p className={`disp ${styles.launchText}`}>Launch control engaged</p>
            <div className={styles.bar} aria-hidden="true">
                <div className={styles.barFill} />
            </div>
        </div>
    );
}
