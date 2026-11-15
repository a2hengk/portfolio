import type { CSSProperties } from "react";

const COLORS = {
    light: "var(--lb)",
    dark: "var(--db)",
    red: "var(--rd)",
} as const;

type OrbProps = {
    color: keyof typeof COLORS;
    /** CSS width, usually a clamp(). */
    size: string;
    opacity: number;
    /** Drift duration in seconds. */
    duration?: number;
    delay?: number;
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
};

// One big blurred circle of M colour that drifts behind the glass. Its
// section (or .page) has to be position: relative.
export default function Orb({ color, size, opacity, duration, delay, top, right, bottom, left }: OrbProps) {
    const style: CSSProperties = {
        width: size,
        background: COLORS[color],
        opacity,
        top,
        right,
        bottom,
        left,
        animationDuration: duration ? `${duration}s` : undefined,
        animationDelay: delay ? `${delay}s` : undefined,
    };

    return <div className="orb" aria-hidden="true" style={style} />;
}
