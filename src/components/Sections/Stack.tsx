import type { Dictionary } from "@/app/[lang]/dictionaries";
import Orb from "@/components/Layout/Orb";
import Clock from "./Clock";
import styles from "./Stack.module.css";

type StackDict = Dictionary["home"]["stack"];

// Rough, self-eyeballed ranking of how much each tool is actually open on a
// given day - not measured telemetry, just an honest ordering by feel,
// read out like a timing tower.
const SOFTWARE: { name: string; category: keyof StackDict["categories"]; load: number }[] = [
    { name: "VS Code", category: "editor", load: 96 },
    { name: "GitHub", category: "versionControl", load: 90 },
    { name: "WSL2", category: "devEnvironment", load: 85 },
    { name: "Copilot", category: "aiPair", load: 80 },
    { name: "Discord", category: "chat", load: 74 },
    { name: "Spotify", category: "audio", load: 69 },
    { name: "Vercel", category: "hosting", load: 61 },
    { name: "Cloudflare", category: "infra", load: 54 },
    { name: "Notion", category: "notes", load: 46 },
    { name: "Canva", category: "design", load: 33 },
];

const STACK: { group: Exclude<keyof StackDict["groups"], "interests">; tools: string[] }[] = [
    { group: "frontend", tools: ["Next.js", "TypeScript", "React", "HTML", "CSS"] },
    { group: "backend", tools: ["Node.js", "Python", "PostgreSQL", "Drizzle ORM", "Docker", "C#", "Java", "REST APIs"] },
    { group: "workflow", tools: ["Git", "GitHub", "VS Code", "WSL2", "Cloudflare", "Vercel"] },
];

type RigPart = keyof StackDict["rig"];

const RIG: { id: RigPart; value: string }[] = [
    { id: "cpu", value: "Intel Core i5 14600KF" },
    { id: "gpu", value: "AMD Radeon RX 9060 XT" },
    { id: "ram", value: "Kingston Fury 32GB DDR5" },
    { id: "ssd", value: "Samsung 990 EVO Plus 2TB" },
    { id: "mobo", value: "B760 Gaming Plus WiFi" },
    { id: "cooling", value: "NZXT Kraken 360" },
    { id: "io", value: "Attack Shark M86 & X3" },
    { id: "display", value: "2x 27\" 1080p, 180Hz / 165Hz" },
];

// One line icon per hardware part.
function RigIcon({ id }: { id: RigPart }) {
    return (
        <span className="ic" aria-hidden="true">
            <svg viewBox="0 0 24 24">
                {id === "cpu" ? (
                    <>
                        <rect x="7" y="7" width="10" height="10" rx="1.2" />
                        <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" />
                    </>
                ) : null}
                {id === "gpu" ? (
                    <>
                        <rect x="2.5" y="6" width="19" height="12" rx="1.5" />
                        <circle cx="8" cy="12" r="2.4" />
                        <circle cx="15" cy="12" r="2.4" />
                        <path d="M2.5 18v2M6 18v2" />
                    </>
                ) : null}
                {id === "ram" ? (
                    <>
                        <rect x="4" y="4" width="16" height="15" rx="1.2" />
                        <path d="M8 4v3M12 4v3M16 4v3M8 19v2M16 19v2" />
                    </>
                ) : null}
                {id === "ssd" ? (
                    <>
                        <rect x="3" y="6" width="18" height="12" rx="2" />
                        <circle cx="16.5" cy="12" r="2.1" />
                        <path d="M6 9.5h5M6 14.5h3" />
                    </>
                ) : null}
                {id === "mobo" ? (
                    <>
                        <rect x="3" y="3" width="18" height="18" rx="1.5" />
                        <rect x="7" y="7" width="6" height="6" rx="0.8" />
                        <path d="M16 7v4M19 11h-4M16 15.5h3.5" />
                    </>
                ) : null}
                {id === "cooling" ? (
                    <>
                        <circle cx="12" cy="12" r="1.6" />
                        <path d="M12 10.4c0-3 1.6-5.4 3.6-5.4s2.4 2 .8 3.6c-1 1-2.6 1.4-4.4 1.8Z" />
                        <path d="M13.6 12c3 0 5.4 1.6 5.4 3.6s-2 2.4-3.6.8c-1-1-1.4-2.6-1.8-4.4Z" />
                        <path d="M10.4 12c-3 0-5.4-1.6-5.4-3.6s2-2.4 3.6-.8c1 1 1.4 2.6 1.8 4.4Z" />
                    </>
                ) : null}
                {id === "io" ? (
                    <>
                        <rect x="8" y="3" width="8" height="18" rx="4" />
                        <path d="M12 3v6" />
                    </>
                ) : null}
                {id === "display" ? (
                    <>
                        <rect x="2.5" y="4" width="19" height="12" rx="1.5" />
                        <path d="M8 20h8M12 16v4" />
                    </>
                ) : null}
            </svg>
        </span>
    );
}

export default function StackSection({ dict }: { dict: StackDict }) {
    const groups = [
        ...STACK.map((entry) => ({ label: dict.groups[entry.group], tools: entry.tools })),
        { label: dict.groups.interests, tools: dict.interests },
    ];

    return (
        <section id="stack" className="sec">
            <Orb color="dark" size="clamp(260px, 40vw, 600px)" opacity={0.85} left="-8%" top="12%" duration={44} />
            <Orb color="red" size="clamp(200px, 28vw, 420px)" opacity={0.34} left="32%" bottom="4%" duration={36} delay={-14} />

            <div className="wrap">
                <h2 className="disp h2 rv">{dict.title}</h2>
                <p className={`mut rv ${styles.lead}`}>{dict.text}</p>

                <div className={styles.layout}>
                    <div className={`glass rv ${styles.tower}`}>
                        <div className={styles.towerHead}>
                            <h3>{dict.towerTitle}</h3>
                            <span className={styles.clock}>
                                <span className="dot live" aria-hidden="true" />
                                <span className="mut">{dict.local}</span>
                                <strong>
                                    <Clock locale={dict.clockLocale} />
                                </strong>
                            </span>
                        </div>
                        <ol className={styles.positions}>
                            {SOFTWARE.map((tool, index) => {
                                const lead = index === 0;

                                return (
                                    <li key={tool.name} className={styles.tw}>
                                        <span className={`disp ${styles.pos} ${lead ? styles.lead1 : ""}`}>P{index + 1}</span>
                                        <span className={styles.tool}>
                                            <span className={styles.toolName}>{tool.name}</span>
                                            <span className="mut">{dict.categories[tool.category]}</span>
                                        </span>
                                        <span className={styles.bar} aria-hidden="true">
                                            <i className={lead ? styles.lead1 : undefined} style={{ width: `${tool.load}%` }} />
                                        </span>
                                        <span className={styles.pct}>{tool.load}%</span>
                                    </li>
                                );
                            })}
                        </ol>
                        <p className={`mut ${styles.note}`}>{dict.note}</p>
                    </div>

                    <div className={styles.side}>
                        <div className={`rv ${styles.block}`}>
                            <h3>{dict.stackTitle}</h3>
                            {groups.map((group) => (
                                <div key={group.label} className={styles.group}>
                                    <span className="mut">{group.label}</span>
                                    <ul className={styles.chips}>
                                        {group.tools.map((tool) => (
                                            <li key={tool} className="chip">
                                                {tool}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className={`rv ${styles.block}`}>
                            <h3>{dict.rigTitle}</h3>
                            <ul className={styles.rig}>
                                {RIG.map((part) => (
                                    <li key={part.id} className={styles.part}>
                                        <RigIcon id={part.id} />
                                        <span className={styles.partText}>
                                            <span className="mut">{dict.rig[part.id]}</span>
                                            <span className={styles.partValue}>{part.value}</span>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
