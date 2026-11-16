import Image from "next/image";
import styles from "./Builds.module.css";

export type BuildArtKind = "lunasOs" | "lunaracing" | "lunair";
export type BuildIconKind = "graph" | "bot" | "browser" | "cards" | "gamepad";

// Small line drawing per featured build. The frame is shared, so a real
// screenshot can drop into the same spot later: pass `image` and the
// drawing steps aside.
export function BuildArt({ kind, image }: { kind: BuildArtKind; image?: { src: string; alt: string } }) {
    if (image) {
        return (
            <Image
                className={styles.thumb}
                src={image.src}
                alt={image.alt}
                width={720}
                height={300}
                sizes="(max-width: 760px) 100vw, 33vw"
            />
        );
    }

    return (
        <svg className={styles.thumb} viewBox="0 0 360 150" aria-hidden="true">
            {kind === "lunasOs" ? <LunasOsArt /> : null}
            {kind === "lunaracing" ? <LunaracingArt /> : null}
            {kind === "lunair" ? <LunairArt /> : null}
        </svg>
    );
}

// Dashboard: a todo window, a timetable grid with today in red, a dock.
function LunasOsArt() {
    return (
        <>
            <rect className={styles.ilF} x="36" y="16" width="168" height="92" rx="10" />
            <path className={styles.il} d="M36,36H204" />
            <circle className={styles.ilD} cx="50" cy="26" r="2.6" />
            <circle className={styles.ilD} cx="60" cy="26" r="2.6" />
            <circle className={styles.ilD} cx="70" cy="26" r="2.6" />
            <rect className={styles.il} x="50" y="48" width="10" height="10" rx="3" />
            <path className={styles.il} d="M70,53H150" />
            <rect className={styles.il} x="50" y="66" width="10" height="10" rx="3" />
            <path className={styles.il} d="M70,71H176" />
            <path className={styles.ilB} d="M51,89l3,3 6,-7" />
            <path className={styles.il} d="M70,89H132" />
            <rect className={styles.ilF} x="188" y="46" width="136" height="76" rx="10" />
            <path className={styles.il} d="M188,64H324" />
            <path className={`${styles.il} ${styles.faint}`} d="M204,78H308M204,92H308M204,106H308M230,70V116M256,70V116M282,70V116" />
            <rect className={styles.ilR} x="259" y="81" width="20" height="9" rx="3" />
            <rect className={styles.ilF} x="126" y="128" width="108" height="16" rx="8" />
            <circle className={styles.ilD} cx="150" cy="136" r="3" />
            <circle className={styles.ilD} cx="170" cy="136" r="3" />
            <circle className={styles.ilD} cx="190" cy="136" r="3" />
            <circle className={styles.ilD} cx="210" cy="136" r="3" />
        </>
    );
}

// Telemetry: two laps' speed traces on top of each other, sector lines.
function LunaracingArt() {
    return (
        <>
            <path className={`${styles.il} ${styles.faint}`} d="M24,126H336M24,24V126" />
            <path className={`${styles.il} ${styles.faint} ${styles.dashed}`} d="M128,24V126M232,24V126" />
            <path className={styles.il} d="M24,96C48,40 70,36 92,64S124,112 152,70 196,30 226,58 268,112 296,84 322,48 336,40" />
            <path className={styles.ilB} d="M24,104C48,54 72,50 94,76S128,118 156,82 198,44 228,70 270,118 298,94 324,60 336,54" />
            <circle className={styles.ilR} cx="226" cy="58" r="4" />
        </>
    );
}

// Photo feed: a photo card, a post with a heart, the shared pet's paw.
function LunairArt() {
    return (
        <>
            <rect className={styles.ilF} x="44" y="20" width="112" height="110" rx="12" />
            <path className={styles.il} d="M56,112L88,74 108,96 122,82 144,112" />
            <circle className={styles.il} cx="128" cy="46" r="9" />
            <rect className={styles.ilF} x="172" y="36" width="96" height="94" rx="12" />
            <path className={styles.ilB} d="M220,100C200,86 204,66 220,76 236,66 240,86 220,100Z" />
            <circle className={styles.il} cx="306" cy="84" r="11" />
            <circle className={styles.il} cx="290" cy="64" r="4.5" />
            <circle className={styles.il} cx="301" cy="56" r="4.5" />
            <circle className={styles.il} cx="313" cy="56" r="4.5" />
            <circle className={styles.il} cx="324" cy="64" r="4.5" />
        </>
    );
}

export function BuildIcon({ kind }: { kind: BuildIconKind }) {
    return (
        <span className="ic" aria-hidden="true">
            <svg viewBox="0 0 24 24">
                {kind === "graph" ? (
                    <>
                        <circle cx="6" cy="7" r="2.2" />
                        <circle cx="18" cy="6" r="2.2" />
                        <circle cx="12" cy="17" r="2.2" />
                        <path d="M8.1 6.8l7.7-.6M7.1 8.9l3.8 6.2M16.9 7.9l-3.8 7.2" />
                    </>
                ) : null}
                {kind === "bot" ? (
                    <>
                        <rect x="4" y="8" width="16" height="11" rx="4" />
                        <path d="M12 8V4.6" />
                        <circle className="f" cx="12" cy="3.6" r="1" />
                        <circle className="f" cx="9.5" cy="13.5" r="0.9" />
                        <circle className="f" cx="14.5" cy="13.5" r="0.9" />
                    </>
                ) : null}
                {kind === "browser" ? (
                    <>
                        <rect x="3" y="5" width="18" height="14" rx="2.5" />
                        <path d="M3 9.5h18" />
                        <circle className="f" cx="6" cy="7.3" r="0.7" />
                        <circle className="f" cx="8.4" cy="7.3" r="0.7" />
                    </>
                ) : null}
                {kind === "cards" ? (
                    <>
                        <rect x="7" y="8" width="13" height="10" rx="2" />
                        <path d="M4.5 15V7.5a2 2 0 0 1 2-2H17" />
                    </>
                ) : null}
                {kind === "gamepad" ? (
                    <>
                        <rect x="3" y="8" width="18" height="9" rx="4.5" />
                        <path d="M7.5 11v3M6 12.5h3" />
                        <circle className="f" cx="16" cy="12.5" r="0.9" />
                    </>
                ) : null}
            </svg>
        </span>
    );
}
