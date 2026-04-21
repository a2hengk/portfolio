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
            title: "Reusable Section System",
            description:
                "Structured section and button components to scale content updates while keeping styling consistent.",
            tags: ["Architecture", "Refactor", "DX"],
            github: "https://github.com/a2hengk/portfolio",
        },
        {
            id: 3,
            type: "Build",
            status: "Planned",
            title: "Links and Setup Hub",
            description:
                "Dedicated links page for socials, tools, and PC components so visitors can see your full setup.",
            tags: ["Socials", "Uses", "Personal Brand"],
            demo: "/links",
        },
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
