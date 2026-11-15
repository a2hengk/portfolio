"use client";

import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import styles from "./links.module.css";

type CopyState = keyof Dictionary["links"]["copy"];

// Discord has no profile link to send people to, so the row copies the
// handle instead and says so for a moment.
export default function CopyHandle({ handle, dict }: { handle: string; dict: Dictionary["links"]["copy"] }) {
    const [state, setState] = useState<CopyState>("idle");
    const timer = useRef<number | undefined>(undefined);

    useEffect(() => () => window.clearTimeout(timer.current), []);

    const settle = (next: CopyState) => {
        setState(next);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setState("idle"), 2000);
    };

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(handle);
            settle("done");
        } catch {
            settle("failed");
        }
    };

    return (
        <button type="button" className={styles.copy} onClick={copy} aria-live="polite">
            {dict[state]}
        </button>
    );
}
