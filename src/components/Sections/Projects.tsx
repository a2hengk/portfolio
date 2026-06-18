import Link from "next/link";

export default function ProjectsSection() {
    const projects = [
        {
            id: 1,
            type: "Website",
            status: "Live",
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
            status: "In Progress",
            title: "Pygame",
            description:
                "Creating something like Mario to learn the library and refresh my python skills. It will be open sourced once it's in a presentable state.",
            tags: ["Python", "Pygame", "Game Development"],
            github: "https://github.com/a2hengk/",
        },
        {
            id: 3,
            type: "Build",
            status: "Live",
            title: "Discord Bot",
            description:
                "A simple Discord bot for managing server activities and providing useful information.",
            tags: ["Python", "Discord API", "Bot Development"],
            github: "https://github.com/a2hengk/discordbot",
        },
        {
            id: 4,
            type: "Build",
            status: "In Progress",
            title: "Personal Blog",
            description:
                "A personal blog to share my thoughts, experiences, and projects with the world.",
            tags: ["Next.js", "Markdown", "Static Site Generation"],
            github: "https://github.com/a2hengk/Lunair",
        },
        {
            id: 5,
            type: "Website",
            status: "In Progress",
            title: "Karteikarten App",
            description:
                "A flashcard app for creating and studying digital flashcards. Also the project for my studies at DHBW.",
            tags: ["React", "Next.js", "TypeScript", "Sqlite"],
            github: "https://github.com/a2hengk/Die-Kleinen-Einsteins",
        }
    ];

    return (
        <section className="section" id="projects">
            <div className="section__heading">
                <p className="eyebrow">Projects and builds</p>
                <h2>What I&apos;m building and where each project stands.</h2>
            </div>
            <div className="project-grid">
                {projects.map((project) => (
                    <article key={project.id} className="project-card">
                        <div className="project-card__top">
                            <p className="project-card__meta">{project.type}</p>
                            <span className="status-badge">{project.status}</span>
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
                ))}
            </div>
        </section>
    );
}
