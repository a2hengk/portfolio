"use client";

import { useEffect } from "react";

// Sitewide decoration: a cursor-following glow (via CSS vars on <html>) and
// a console hint pointing curious visitors at the Konami-code easter egg.
// Rendered once from the root layout.
export default function BackgroundFX() {
    useEffect(() => {
        let raf = 0;

        const onMove = (event: MouseEvent) => {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                document.documentElement.style.setProperty("--mx", `${event.clientX}px`);
                document.documentElement.style.setProperty("--my", `${event.clientY}px`);
                raf = 0;
            });
        };

        window.addEventListener("mousemove", onMove, { passive: true });

        console.log(
            "%cSector 00 online.%c Psst - there's a secret sector. Try ↑ ↑ ↓ ↓ ← → ← → B A.",
            "color:#00e7ff;font-family:monospace;font-size:12px;font-weight:700;",
            "color:#8ecdfb;font-family:monospace;font-size:12px;"
        );

        return () => {
            window.removeEventListener("mousemove", onMove);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    return <div className="cursor-glow" aria-hidden="true" />;
}
