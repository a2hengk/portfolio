import Link from "next/link";

type StatusKey = "live" | "progress" | "featured";

const statusMeta: Record<StatusKey, { label: string; badgeClass: string; positionClass: string }> = {
    live: { label: "Live", badgeClass: "status-badge--live", positionClass: "position-badge--live" },
    progress: { label: "In Progress", badgeClass: "status-badge--progress", positionClass: "position-badge--progress" },
    featured: { label: "Featured", badgeClass: "status-badge--featured", positionClass: "position-badge--featured" },
};

export default function ProjectsSection() {
    const projects: {
        id: number;
        type: string;
        status: StatusKey;
        title: string;
        description: string;
        tags: string[];
        github?: string;
        demo?: string;
    }[] = [
        {
            id: 1,
            type: "Website",
            status: "featured",
            title: "Portfolio Platform",
            description:
                "Personal portfolio with component architecture, motion, responsive layout, and section-based storytelling.",
            tags: ["Next.js", "TypeScript", "CSS Modules"],
            github: "https://github.com/a2hengk/portfolio",
            demo: "#top",
        },
        {
            id: 2,
            type: "Build",
            status: "progress",
            title: "Pygame",
            description:
                "Creating something like Mario to learn the library and refresh my python skills. It will be open sourced once it's in a presentable state.",
            tags: ["Python", "Pygame", "Game Development"],
            github: "https://github.com/a2hengk/",
        },
        {
            id: 3,
            type: "Build",
            status: "live",
            title: "Discord Bot",
            description:
                "A simple Discord bot for managing server activities and providing useful information.",
            tags: ["Python", "Discord API", "Bot Development"],
            github: "https://github.com/a2hengk/discordbot",
        },
        {
            id: 4,
            type: "Build",
            status: "progress",
            title: "Personal Blog",
            description:
                "A personal blog to share my thoughts, experiences, and projects with the world.",
            tags: ["Next.js", "Markdown", "Static Site Generation"],
            github: "https://github.com/a2hengk/Lunair",
        },
        {
            id: 5,
            type: "Website",
            status: "progress",
            title: "Karteikarten App",
            description:
                "A flashcard app for creating and studying digital flashcards. Also the project for my studies at DHBW.",
            tags: ["React", "Next.js", "TypeScript", "Sqlite"],
            github: "https://github.com/a2hengk/Die-Kleinen-Einsteins",
        }
    ];

    return (
        <section className="section" id="projects">
            <span className="livery-stripe livery-stripe--1" aria-hidden="true" />
            <span className="livery-stripe livery-stripe--2" aria-hidden="true" />
            <span className="livery-stripe livery-stripe--3" aria-hidden="true" />

            <svg className="circuit-line" style={{ left: "-60px", bottom: "-50px", width: "520px", height: "340px" }} viewBox="0 0 520 340" fill="none" aria-hidden="true">
                <path d="M20 40 C 90 30, 130 60, 120 110 C 112 150, 60 155, 65 195 C 70 240, 140 235, 165 200 C 195 158, 175 100, 220 70 C 265 40, 330 55, 345 105 C 358 148, 320 175, 340 215 C 358 250, 420 250, 445 210" stroke="var(--text)" strokeWidth="3" strokeLinecap="round" />
                <circle cx="20" cy="40" r="5" fill="var(--text)" />
                <circle cx="445" cy="210" r="5" fill="var(--text)" />
            </svg>

            <div className="section__heading">
                <div className="section-marker">
                    <span className="sector-tag">Sector 03</span>
                    <p className="eyebrow">Projects and builds</p>
                </div>
                <h2>What I&apos;m building and where each project stands.</h2>
                <div className="tick-divider" aria-hidden="true" />
            </div>
            <div className="project-grid">
                {projects.map((project, index) => {
                    const meta = statusMeta[project.status];

                    return (
                        <article key={project.id} className="project-card">
                            <span className={`position-badge ${meta.positionClass}`}>
                                <span>P{index + 1}</span>
                            </span>
                            <div className="project-card__top">
                                <p className="project-card__meta">{project.type}</p>
                                <span className={`status-badge ${meta.badgeClass}`}>
                                    <span className="status-badge__dot" />
                                    {meta.label}
                                </span>
                            </div>
                            <h3>{project.title}</h3>
                            <p>{project.description}</p>
                            <div className="project-tags" aria-label="Project stack">
                                {project.tags.map((tag) => (
                                    <span key={tag}>{tag}</span>
                                ))}
                            </div>
                            <div className="project-links">
                                {project.github ? (
                                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                                        GitHub
                                    </a>
                                ) : null}
                                {project.demo ? (
                                    project.demo.startsWith("/") || project.demo.startsWith("#") ? (
                                        <Link href={project.demo}>Open</Link>
                                    ) : (
                                        <a href={project.demo} target="_blank" rel="noopener noreferrer">
                                            Open
                                        </a>
                                    )
                                ) : null}
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
