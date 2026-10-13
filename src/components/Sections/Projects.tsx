import Link from "next/link";

type StatusKey = "live" | "progress" | "featured";

const statusMeta: Record<StatusKey, { label: string; badgeClass: string; positionClass: string }> = {
    live: { label: "Live", badgeClass: "status-badge--live", positionClass: "position-badge--live" },
    progress: { label: "In Progress", badgeClass: "status-badge--progress", positionClass: "position-badge--progress" },
    featured: { label: "Featured", badgeClass: "status-badge--featured", positionClass: "position-badge--featured" },
};

type Project = {
    id: number;
    type: string;
    status: StatusKey;
    title: string;
    description: string;
    tags: string[];
    github?: string;
    // No public repo to link yet - renders a "repo coming soon" note instead of a link.
    repoComingSoon?: boolean;
    demo?: string;
    // Optional deep-dive content, rendered in a per-card <details> disclosure
    // when present. Fields left out just don't render - see ProjectDetails below.
    about?: string;
    highlights?: string[];
};

// The about/highlights text below was drafted by reading each repo's README
// (and, for the portfolio itself, the actual source in this project) - not
// invented. Review the wording before treating it as final copy. Projects
// with no public repo content yet (Pygame) are left as TODOs
// instead of guessed-at copy.
export default function ProjectsSection() {
    const projects: Project[] = [
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
            about:
                "This site - built to actually learn Next.js properly instead of just reading about it, and to have something online that's mine instead of a template. Everything runs on a BMW M / racing theme, down to the small stuff.",
            highlights: [
                "Hand-built BMW M livery theme and motion carried through every page, not just the homepage",
                "Traced the real Nürburgring Nordschleife track geometry for the /experience timeline map",
                "A couple of hidden easter eggs, including a launch-control sequence and a small race mini-game",
            ],
        },
        {
            id: 2,
            type: "Build",
            status: "progress",
            title: "Pygame",
            description:
                "Creating something like Mario to learn the library and refresh my python skills. It will be open sourced once it's in a presentable state.",
            tags: ["Python", "Pygame", "Game Development"],
            // TODO(Kevin): no public repo yet - add the link (and about/highlights) once it's up.
            repoComingSoon: true,
        },
        {
            id: 3,
            type: "Build",
            status: "live",
            title: "Discord Bot",
            description:
                "My own Discord bot for running a server: ticket system, audit log, welcome messages, moderation tools and a few minigames.",
            tags: ["Python", "discord.py", "Slash Commands"],
            github: "https://github.com/a2hengk/discordbot",
            about:
                "One of my first projects, recently rebuilt from scratch. Every feature is its own cog that gets loaded automatically, so adding something new is just dropping a file into a folder.",
            highlights: [
                "Ticket panel with claim/close buttons - closed tickets get archived as a .txt transcript",
                "Audit log for joins, leaves, deleted and edited messages, with a word-level diff for edits",
                "Per-server settings via /config that survive restarts",
                "Minigames like rock-paper-scissors, number guessing and a typing speed test that catches copy-paste",
            ],
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
            about:
                "Draft: right now this is just the Next.js + Tailwind starting point, not built out yet. The plan is a lightweight blog for writing about projects and whatever else is going on.",
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
            about:
                "A flashcard app for creating and studying your own cards - built as the practical project for my studies at DHBW, with a real Postgres/Drizzle backend behind it instead of just local state.",
            highlights: [
                "Card overview to create, edit, and delete your own flashcard sets",
                "Self-study mode with a flip-card animation, progress saved per card",
                "Login/register so cards and progress follow you across devices",
            ],
        },
        {
            id: 6,
            type: "Website",
            status: "live",
            title: "LUNAS OS",
            description:
                "My personal HUD-style home dashboard for everyday life and vocational school: todos, appointments, timetable, grades and a private file storage.",
            tags: ["Next.js", "TypeScript", "Tailwind", "Drizzle", "Postgres", "Vercel Blob"],
            github: "https://github.com/a2hengk/home-dashboard",
            about:
                "Built for myself first, with my vocational school (Berufsschule) as the main use case. Everything school-related hangs off its Lernfeld, so files, todos, appointments and grades for one subject live on one page. Single user, GitHub login only.",
            highlights: [
                "Today view with a countdown to the next exam, a 14-day timeline and the day's timetable",
                "Private file storage with folders and drag-and-drop - files are only served after a server-side login check",
                "Per-subject pages with files, todos, appointments and a grade average",
                "Todos split into school, private and work",
            ],
        },
    ];

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
                    <span className="sector-tag">Sector 03</span>
                    <p className="eyebrow">Projects and builds</p>
                </div>
                <h2>What I&apos;m building and where each project stands.</h2>
                <div className="tick-divider" aria-hidden="true" />
            </div>
            <div className="project-grid">
                {projects.map((project, index) => {
                    const meta = statusMeta[project.status];
                    const hasDetails = Boolean(project.about || project.highlights?.length);

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
                                ) : project.repoComingSoon ? (
                                    <span className="project-links__note">Repo coming soon</span>
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

                            {hasDetails ? (
                                <details className="project-card__details">
                                    <summary>More about this build</summary>
                                    <div className="project-card__details-body">
                                        {project.about ? <p>{project.about}</p> : null}
                                        {project.highlights?.length ? (
                                            <ul className="project-card__highlights">
                                                {project.highlights.map((point) => (
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
