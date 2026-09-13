"use client";

import { useEffect, useState } from "react";

type SoftwareItem = {
    name: string;
    category: string;
    load: number;
};

type SetupPart = {
    id: "cpu" | "gpu" | "ram" | "ssd" | "mobo" | "cooling" | "io" | "display";
    category: string;
    label: string;
    value: string;
};

// Rough, self-eyeballed ranking of how much each tool is actually open on a
// given day - not measured telemetry (nothing on this machine is reporting
// in), just an honest ordering by feel, styled like a dash so it fits the
// rest of the site.
const SOFTWARE: SoftwareItem[] = [
    { name: "VS Code", category: "Editor", load: 96 },
    { name: "GitHub", category: "Version control", load: 90 },
    { name: "WSL2", category: "Dev environment", load: 85 },
    { name: "Copilot", category: "AI pair", load: 80 },
    { name: "Discord", category: "Chat", load: 74 },
    { name: "Spotify", category: "Audio", load: 69 },
    { name: "Vercel", category: "Hosting", load: 61 },
    { name: "Cloudflare", category: "Infra", load: 54 },
    { name: "Notion", category: "Notes", load: 46 },
    { name: "Canva", category: "Design", load: 33 },
];

const SETUP: SetupPart[] = [
    { id: "cpu", category: "CPU", label: "Processor", value: "Intel Core i5 14600KF" },
    { id: "gpu", category: "GPU", label: "Graphics", value: "AMD Radeon RX 9060 XT" },
    { id: "ram", category: "RAM", label: "Memory", value: "Kingston Fury 32GB DDR5" },
    { id: "ssd", category: "SSD", label: "Storage", value: "Samsung 990 EVO Plus 2TB" },
    { id: "mobo", category: "MOBO", label: "Mainboard", value: "B760 Gaming Plus WiFi" },
    { id: "cooling", category: "AIO", label: "Cooling", value: "NZXT Kraken 360" },
    { id: "io", category: "I/O", label: "Peripherals", value: "Attack Shark M86 & X3" },
    { id: "display", category: "DISP", label: "Monitors", value: "2x 27\" 1080p · 180Hz / 165Hz" },
];

// Small line icons, one per part category - same stroke-and-viewBox recipe
// as the skill icons on /about, just aimed at hardware instead of stacks.
function SetupIcon({ id }: { id: SetupPart["id"] }) {
    const shared = {
        className: "setup-card__icon",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.8,
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
        "aria-hidden": true,
    };

    switch (id) {
        case "cpu":
            return (
                <svg {...shared}>
                    <rect x="7" y="7" width="10" height="10" rx="1.2" />
                    <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" />
                </svg>
            );
        case "gpu":
            return (
                <svg {...shared}>
                    <rect x="2.5" y="6" width="19" height="12" rx="1.5" />
                    <circle cx="8" cy="12" r="2.4" />
                    <circle cx="15" cy="12" r="2.4" />
                    <path d="M2.5 18v2M6 18v2" />
                </svg>
            );
        case "ram":
            return (
                <svg {...shared}>
                    <rect x="4" y="4" width="16" height="15" rx="1.2" />
                    <path d="M8 4v3M12 4v3M16 4v3M8 19v2M16 19v2" />
                </svg>
            );
        case "ssd":
            return (
                <svg {...shared}>
                    <rect x="3" y="6" width="18" height="12" rx="2" />
                    <circle cx="16.5" cy="12" r="2.1" />
                    <path d="M6 9.5h5M6 14.5h3" />
                </svg>
            );
        case "mobo":
            return (
                <svg {...shared}>
                    <rect x="3" y="3" width="18" height="18" rx="1.5" />
                    <rect x="7" y="7" width="6" height="6" rx="0.8" />
                    <path d="M16 7v4M19 11h-4M16 15.5h3.5" />
                </svg>
            );
        case "cooling":
            return (
                <svg {...shared}>
                    <circle cx="12" cy="12" r="1.6" />
                    <path d="M12 10.4c0-3 1.6-5.4 3.6-5.4s2.4 2 .8 3.6c-1 1-2.6 1.4-4.4 1.8Z" />
                    <path d="M13.6 12c3 0 5.4 1.6 5.4 3.6s-2 2.4-3.6.8c-1-1-1.4-2.6-1.8-4.4Z" />
                    <path d="M10.4 12c-3 0-5.4-1.6-5.4-3.6s2-2.4 3.6-.8c1 1 1.4 2.6 1.8 4.4Z" />
                </svg>
            );
        case "io":
            return (
                <svg {...shared}>
                    <rect x="8" y="3" width="8" height="18" rx="4" />
                    <path d="M12 3v6" />
                </svg>
            );
        case "display":
            return (
                <svg {...shared}>
                    <rect x="2.5" y="4" width="19" height="12" rx="1.5" />
                    <path d="M8 20h8M12 16v4" />
                </svg>
            );
        default:
            return null;
    }
}

function formatClock(date: Date | null) {
    if (!date) {
        return "--:--:--";
    }
    return date.toLocaleTimeString("en-GB", { hour12: false });
}

function formatSession(totalSeconds: number) {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    const s = (totalSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

// The one genuinely live thing on this page: a local-time readout and a
// count-up since the page was opened, ticking every second like a lap
// timer. The software "load" bars below it are a fixed ranking, not a
// live feed - see the SOFTWARE comment above.
function useGarageClock() {
    const [now, setNow] = useState<Date | null>(null);
    const [sessionSeconds, setSessionSeconds] = useState(0);

    useEffect(() => {
        setNow(new Date());
        const id = window.setInterval(() => {
            setNow(new Date());
            setSessionSeconds((s) => s + 1);
        }, 1000);
        return () => window.clearInterval(id);
    }, []);

    return { now, sessionSeconds };
}

export default function UsesSection() {
    const { now, sessionSeconds } = useGarageClock();

    return (
        <>
            <section className="route-section garage-panel">
                <span className="hud-corner hud-corner--tl" aria-hidden="true" />
                <span className="hud-corner hud-corner--tr" aria-hidden="true" />
                <span className="hud-corner hud-corner--bl" aria-hidden="true" />
                <span className="hud-corner hud-corner--br" aria-hidden="true" />

                <div className="section__heading">
                    <div className="section-marker">
                        <span className="sector-tag">Garage</span>
                        <p className="eyebrow">Live loadout</p>
                    </div>
                    <h2>What&apos;s running right now.</h2>
                    <p>
                        The software that&apos;s actually open most days, ranked and read out like a dash - plus a genuinely live clock, because a garage board should tell real time.
                    </p>
                </div>

                <div className="garage-readout" role="status" aria-live="off">
                    <span className="garage-readout__dot" aria-hidden="true" />
                    <span className="garage-readout__item">
                        <span className="garage-readout__label">Local</span>
                        {formatClock(now)}
                    </span>
                    <span className="garage-readout__sep" aria-hidden="true" />
                    <span className="garage-readout__item">
                        <span className="garage-readout__label">Session</span>
                        {formatSession(sessionSeconds)}
                    </span>
                </div>

                <div className="software-grid">
                    {SOFTWARE.map((item) => (
                        <div key={item.name} className="software-card">
                            <div className="software-card__top">
                                <strong>{item.name}</strong>
                                <span className="software-card__category">{item.category}</span>
                            </div>
                            <div className="software-card__meter">
                                <div className="software-card__track">
                                    <div className="software-card__fill" style={{ width: `${item.load}%` }} />
                                </div>
                                <span className="software-card__value">{item.load}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="route-section">
                <div className="section__heading">
                    <div className="section-marker">
                        <span className="sector-tag">Setup</span>
                        <p className="eyebrow">Current setup</p>
                    </div>
                    <h2>The setup I actually use.</h2>
                </div>
                <div className="setup-grid">
                    {SETUP.map((part) => (
                        <div key={part.id} className="setup-card">
                            <SetupIcon id={part.id} />
                            <div className="setup-card__body">
                                <span className="setup-card__type">{part.category}</span>
                                <strong>{part.value}</strong>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
