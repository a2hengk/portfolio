import Link from "next/link";
import type { Dictionary } from "@/app/[lang]/dictionaries";

type StatusKey = "live" | "progress" | "featured" | "planned";

const statusMeta: Record<StatusKey, { badgeClass: string; positionClass: string }> = {
    live: { badgeClass: "status-badge--live", positionClass: "position-badge--live" },
    progress: { badgeClass: "status-badge--progress", positionClass: "position-badge--progress" },
    featured: { badgeClass: "status-badge--featured", positionClass: "position-badge--featured" },
    planned: { badgeClass: "status-badge--planned", positionClass: "position-badge--planned" },
};

// Not every project has about/highlights yet, so those stay optional.
type ProjectCopy = { type: string; title: string; description: string; about?: string; highlights?: string[] };

type Project = {
    id: keyof Dictionary["projects"]["items"];
    status: StatusKey;
    tags: string[];
    github?: string;
    // No public repo to link yet - renders a "repo coming soon" note instead of a link.
    repoComingSoon?: boolean;
    // Repo exists but is private (personal data / licensed assets) - renders a note instead of a link.
    privateRepo?: boolean;
    demo?: string;
};

// Everything text-y (type, title, description, about, highlights) lives in
// the dictionaries under projects.items.<id>; this list only keeps the
// structural bits. The about/highlights text was drafted by reading each
// repo's README (and, for the portfolio itself, the actual source in this
// project) - not invented. Review the wording before treating it as final
// copy. Projects with no public repo content yet (Pygame) are left as TODOs
// instead of guessed-at copy.
const projects: Project[] = [
    {
        id: "1",
        status: "featured",
        tags: ["Next.js", "TypeScript", "CSS Modules"],
        github: "https://github.com/a2hengk/portfolio",
        demo: "#top",
    },
    {
        id: "2",
        status: "progress",
        tags: ["Python", "Pygame", "Game Development"],
        // TODO(Kevin): no public repo yet - add the link (and about/highlights) once it's up.
        repoComingSoon: true,
    },
    {
        id: "3",
        status: "live",
        tags: ["Python", "discord.py", "Slash Commands"],
        github: "https://github.com/a2hengk/discordbot",
    },
    {
        id: "4",
        status: "progress",
        tags: ["Next.js", "TypeScript", "Postgres", "Drizzle", "Better Auth", "Vercel Blob"],
        github: "https://github.com/a2hengk/Lunair",
    },
    {
        id: "5",
        status: "progress",
        tags: ["React", "Next.js", "TypeScript", "Postgres", "Drizzle"],
        github: "https://github.com/a2hengk/Die-Kleinen-Einsteins",
    },
    {
        id: "6",
        status: "live",
        tags: ["Next.js", "TypeScript", "Tailwind", "Drizzle", "Postgres", "Live2D", "Web Speech API"],
        // Repo went private (personal data, Live2D model license doesn't allow redistribution).
        privateRepo: true,
    },
    {
        id: "7",
        status: "progress",
        tags: ["TypeScript", "Node.js", "SQLite", "MCP"],
        github: "https://github.com/a2hengk/lunagraph",
    },
    {
        id: "8",
        status: "planned",
        // Ingest language (C#/.NET vs Node) not decided yet, so it's not in the tags.
        tags: ["Le Mans Ultimate", "Shared Memory", "Postgres", "Next.js"],
        repoComingSoon: true,
    },
];

export default function ProjectsSection({ dict }: { dict: Dictionary["projects"] }) {
    return (
        <section className="section" id="projects">
            <span className="livery-stripe livery-stripe--1" aria-hidden="true" />
            <span className="livery-stripe livery-stripe--2" aria-hidden="true" />
            <span className="livery-stripe livery-stripe--3" aria-hidden="true" />
            <span className="livery-stripe livery-stripe--4" aria-hidden="true" />

            <svg className="circuit-line" style={{ left: "-60px", bottom: "-50px", width: "520px", height: "340px" }} viewBox="0 0 520 340" fill="none" aria-hidden="true">
                <path d="M20 40 C 90 30, 130 60, 120 110 C 112 150, 60 155, 65 195 C 70 240, 140 235, 165 200 C 195 158, 175 100, 220 70 C 265 40, 330 55, 345 105 C 358 148, 320 175, 340 215 C 358 250, 420 250, 445 210" stroke="var(--text)" strokeWidth="3" strokeLinecap="round" />
                <circle cx="20" cy="40" r="5" fill="var(--text)" />
                <circle cx="445" cy="210" r="5" fill="var(--text)" />
            </svg>

            <div className="section__heading">
                <div className="section-marker">
                    <span className="sector-tag">{dict.tag}</span>
                    <p className="eyebrow">{dict.eyebrow}</p>
                </div>
                <h2>{dict.title}</h2>
                <div className="tick-divider" aria-hidden="true" />
            </div>
            <div className="project-grid">
                {projects.map((project, index) => {
                    const meta = statusMeta[project.status];
                    const copy: ProjectCopy = dict.items[project.id];
                    const hasDetails = Boolean(copy.about || copy.highlights?.length);

                    return (
                        <article key={project.id} className="project-card">
                            <span className={`position-badge ${meta.positionClass}`}>
                                <span>P{index + 1}</span>
                            </span>
                            <div className="project-card__top">
                                <p className="project-card__meta">{copy.type}</p>
                                <span className={`status-badge ${meta.badgeClass}`}>
                                    <span className="status-badge__dot" />
                                    {dict.status[project.status]}
                                </span>
                            </div>
                            <h3>{copy.title}</h3>
                            <p>{copy.description}</p>
                            <div className="project-tags" aria-label={dict.stackAria}>
                                {project.tags.map((tag) => (
                                    <span key={tag}>{tag}</span>
                                ))}
                            </div>
                            <div className="project-links">
                                {project.github ? (
                                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                                        GitHub
                                    </a>
                                ) : project.privateRepo ? (
                                    <span className="project-links__note">{dict.privateRepo}</span>
                                ) : project.repoComingSoon ? (
                                    <span className="project-links__note">{dict.repoComingSoon}</span>
                                ) : null}
                                {project.demo ? (
                                    project.demo.startsWith("/") || project.demo.startsWith("#") ? (
                                        <Link href={project.demo}>{dict.open}</Link>
                                    ) : (
                                        <a href={project.demo} target="_blank" rel="noopener noreferrer">
                                            {dict.open}
                                        </a>
                                    )
                                ) : null}
                            </div>

                            {hasDetails ? (
                                <details className="project-card__details">
                                    <summary>{dict.details}</summary>
                                    <div className="project-card__details-body">
                                        {copy.about ? <p>{copy.about}</p> : null}
                                        {copy.highlights?.length ? (
                                            <ul className="project-card__highlights">
                                                {copy.highlights.map((point) => (
                                                    <li key={point}>{point}</li>
                                                ))}
                                            </ul>
                                        ) : null}
                                    </div>
                                </details>
                            ) : null}
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
