export default function ProjectsSection() {
    const projects = [
        {
            id: 1,
            meta: "01 / Interface refresh",
            title: "Editorial landing page",
            description:
                "A premium homepage layout with bold typography, layered backgrounds, and clear calls to action.",
            link: "https://github.com/a2hengk/portfolio",
        },
        {
            id: 2,
            meta: "02 / Design system",
            title: "Reusable component set",
            description:
                "A focused component system built to keep future pages consistent without feeling rigid.",
            link: "https://github.com/a2hengk/portfolio",
        },
        {
            id: 3,
            meta: "03 / Personal brand",
            title: "Portfolio identity",
            description:
                "An approachable visual tone that balances personality, readability, and a strong first impression.",
            link: "https://github.com/a2hengk/portfolio",
        },
    ];

    return (
        <section className="section" id="projects">
            <div className="section__heading">
                <p className="eyebrow">Selected work</p>
                <h2>Projects presented as concise case studies.</h2>
            </div>
            <div className="project-grid">
                {projects.map((project) => (
                    <a
                        key={project.id}
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-card"
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <p className="project-card__meta">{project.meta}</p>
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>
                    </a>
                ))}
            </div>
        </section>
    );
}
