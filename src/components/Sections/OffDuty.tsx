import type { Dictionary } from "@/app/[lang]/dictionaries";
import Orb from "@/components/Layout/Orb";
import styles from "./OffDuty.module.css";

type OffDutyDict = Dictionary["home"]["offDuty"];
type Mode = keyof OffDutyDict["modes"];
type GameIcon = "wheel" | "crosshair" | "cube" | "shield" | "swords" | "road";

// Red = competitive, light blue = just for fun, white ring = laid back.
const MODE_DOT: Record<Mode, string> = {
    competitive: "red",
    forFun: "blue",
    survivalCreative: "calm",
    chilling: "calm",
};

const GAMES: { title: string; mode: Mode; icon: GameIcon }[] = [
    { title: "Assetto Corsa Competizione", mode: "competitive", icon: "wheel" },
    { title: "Valorant", mode: "forFun", icon: "crosshair" },
    { title: "Minecraft", mode: "survivalCreative", icon: "cube" },
    { title: "Apex Legends", mode: "competitive", icon: "shield" },
    { title: "League of Legends", mode: "forFun", icon: "swords" },
    { title: "The Crew 2", mode: "chilling", icon: "road" },
];

// Titles are the shows' names and stay as they are.
const ANIME = [
    { id: "1", title: "Sword Art Online" },
    { id: "2", title: "The Angel Next Door Spoils Me Rotten" },
    { id: "3", title: "World Trigger" },
] as const;

// Neutral symbols, no game logos or cover art.
function GameSymbol({ icon }: { icon: GameIcon }) {
    return (
        <span className="ic" aria-hidden="true">
            <svg viewBox="0 0 24 24">
                {icon === "wheel" ? (
                    <>
                        <circle cx="12" cy="12" r="8.5" />
                        <circle cx="12" cy="12" r="2" />
                        <path d="M12 14v6.5M10.2 11.2 4 9.4M13.8 11.2 20 9.4" />
                    </>
                ) : null}
                {icon === "crosshair" ? (
                    <>
                        <circle cx="12" cy="12" r="6.5" />
                        <path d="M12 2.5v5M12 16.5v5M2.5 12h5M16.5 12h5" />
                    </>
                ) : null}
                {icon === "cube" ? (
                    <>
                        <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
                        <path d="M4 7.5l8 4.5 8-4.5M12 12v9" />
                    </>
                ) : null}
                {icon === "shield" ? <path d="M12 3l7 3v5.5c0 4.5-3 7.6-7 9.5-4-1.9-7-5-7-9.5V6z" /> : null}
                {icon === "swords" ? <path d="M5 4l9 9M19 4l-9 9M8 15l-3.5 3.5M16 15l3.5 3.5M6.5 13.5l4 4M17.5 13.5l-4 4" /> : null}
                {icon === "road" ? <path d="M8 3 4 21M16 3l4 18M12 4v3M12 10.5v3M12 17v3" /> : null}
            </svg>
        </span>
    );
}

export default function OffDutySection({ dict }: { dict: OffDutyDict }) {
    return (
        <section id="offduty" className="sec">
            <Orb color="light" size="clamp(260px, 40vw, 600px)" opacity={0.26} right="-8%" top="20%" duration={40} />

            <div className="wrap">
                <h2 className="disp h2 rv">{dict.title}</h2>
                <p className={`mut rv ${styles.lead}`}>{dict.text}</p>

                <div className={styles.layout}>
                    <div className={styles.games}>
                        <h3 className="rv">{dict.rotationTitle}</h3>
                        <ul className={styles.list}>
                            {GAMES.map((game) => (
                                <li key={game.title} className={`row rv ${styles.game}`}>
                                    <span className={styles.gameName}>
                                        <GameSymbol icon={game.icon} />
                                        <span className="disp">{game.title}</span>
                                    </span>
                                    <span className="stat">
                                        <span className={`dot ${MODE_DOT[game.mode]}`} aria-hidden="true" />
                                        <span>{dict.modes[game.mode]}</span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={`glass rv ${styles.anime}`}>
                        <h3>{dict.animeTitle}</h3>
                        <ol className={styles.ranking}>
                            {ANIME.map((anime, index) => (
                                <li key={anime.id}>
                                    <span className={`disp ${styles.rank}`} aria-hidden="true">
                                        {index + 1}
                                    </span>
                                    <span className={styles.animeText}>
                                        <span className={styles.animeTitle}>{anime.title}</span>
                                        <span className="mut">{dict.anime[anime.id]}</span>
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </section>
    );
}
