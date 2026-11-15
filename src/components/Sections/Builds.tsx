import type { Dictionary } from "@/app/[lang]/dictionaries";
import { ArrowUpRight } from "@/components/Layout/Icons";
import Orb from "@/components/Layout/Orb";
import { BuildArt, BuildIcon, type BuildArtKind, type BuildIconKind } from "./BuildArt";
import styles from "./Builds.module.css";

type BuildsDict = Dictionary["home"]["builds"];
type ItemKey = keyof BuildsDict["items"];
// live = red filled dot, anything still moving = light-blue ring.
type Status = keyof BuildsDict["status"];
// Where the repo is: a public link, private, or not up yet.
type Repo = { github: string } | { note: "privateRepo" | "repoFollows" };

const FEATURED: { key: ItemKey; name: string; status: Status; type: keyof BuildsDict["types"]; art: BuildArtKind; stack: string; repo: Repo }[] = [
    {
        key: "lunasOs",
        name: "Lunas OS",
        status: "live",
        type: "webApp",
        art: "lunasOs",
        stack: "Next.js, TypeScript, Tailwind, Drizzle, Postgres",
        repo: { note: "privateRepo" },
    },
    {
        key: "lunaracing",
        name: "lunaracing",
        status: "progress",
        type: "tool",
        art: "lunaracing",
        stack: "Next.js, Postgres, LMU shared memory, C#/.NET",
        repo: { note: "repoFollows" },
    },
    {
        key: "lunair",
        name: "Lunair",
        status: "progress",
        type: "webApp",
        art: "lunair",
        stack: "Next.js, TypeScript, Postgres, Drizzle, Better Auth, Vercel Blob",
        repo: { github: "https://github.com/a2hengk/Lunair" },
    },
];

const ROWS: { key: ItemKey; name: string; status: Status; icon: BuildIconKind; repo: Repo }[] = [
    { key: "lunagraph", name: "lunagraph", status: "phase1", icon: "graph", repo: { github: "https://github.com/a2hengk/lunagraph" } },
    { key: "discordBot", name: "Discord Bot", status: "live", icon: "bot", repo: { github: "https://github.com/a2hengk/discordbot" } },
    { key: "portfolio", name: "Portfolio", status: "live", icon: "browser", repo: { github: "https://github.com/a2hengk/portfolio" } },
    { key: "karteikarten", name: "Karteikarten App", status: "progress", icon: "cards", repo: { github: "https://github.com/a2hengk/Die-Kleinen-Einsteins" } },
    { key: "pygame", name: "Pygame platformer", status: "progress", icon: "gamepad", repo: { note: "repoFollows" } },
];

function StatusBadge({ status, dict }: { status: Status; dict: BuildsDict }) {
    return (
        <span className="stat">
            <span className={`dot ${status === "live" ? "live" : "wip"}`} aria-hidden="true" />
            <span>{dict.status[status]}</span>
        </span>
    );
}

function RepoLink({ repo, dict, className }: { repo: Repo; dict: BuildsDict; className?: string }) {
    if ("github" in repo) {
        return (
            <a className={`ext ${className ?? ""}`} href={repo.github} target="_blank" rel="noopener noreferrer">
                <span>GitHub</span>
                <ArrowUpRight />
            </a>
        );
    }

    return <span className={`mut ${styles.note} ${className ?? ""}`}>{dict[repo.note]}</span>;
}

export default function BuildsSection({ dict }: { dict: BuildsDict }) {
    return (
        <section id="builds" className="sec">
            <Orb color="red" size="clamp(260px, 40vw, 600px)" opacity={0.4} left="-10%" top="18%" duration={34} />
            <Orb color="dark" size="clamp(260px, 42vw, 640px)" opacity={0.85} right="-6%" top="8%" duration={40} delay={-8} />

            <div className="wrap">
                <h2 className="disp h2 rv">{dict.title}</h2>
                <p className={`mut rv ${styles.lead}`}>{dict.text}</p>

                <div className={styles.grid}>
                    {FEATURED.map((build) => (
                        <article key={build.key} className={`glass card rv ${styles.card}`}>
                            <div className={styles.cardTop}>
                                <StatusBadge status={build.status} dict={dict} />
                                <span className={`mut ${styles.type}`}>{dict.types[build.type]}</span>
                            </div>
                            <BuildArt kind={build.art} />
                            <h3 className={`disp ${styles.cardName}`}>{build.name}</h3>
                            <p className={styles.cardText}>{dict.items[build.key]}</p>
                            <p className={`mut ${styles.stack}`}>{build.stack}</p>
                            <RepoLink repo={build.repo} dict={dict} className={styles.cardRepo} />
                        </article>
                    ))}
                </div>

                <div className={styles.rows}>
                    {ROWS.map((build) => (
                        <article key={build.key} className="row rv">
                            <div className={styles.rowName}>
                                <BuildIcon kind={build.icon} />
                                <h3 className="disp">{build.name}</h3>
                            </div>
                            <p className={`mut ${styles.rowText}`}>{dict.items[build.key]}</p>
                            <div className={styles.rowMeta}>
                                <StatusBadge status={build.status} dict={dict} />
                                <RepoLink repo={build.repo} dict={dict} />
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
