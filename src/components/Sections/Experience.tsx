export default function ExperienceSection() {
    const milestones = [
        {
            year: "2026",
            title: "Software Developer at Herrenknecht AG",
            description:
                "Working on real software with real constraints, learning how to ship maintainable features and communicate clearly with a team.",
            tags: ["Production code", "Team workflows", "Responsibility"],
        },
        {
            year: "2024 - 2026",
            title: "Dual student at DHBW Karlsruhe",
            description:
                "Balancing study and practice while building a foundation in frontend, backend, system thinking, and software engineering habits.",
            tags: ["Computer science", "Hands-on learning", "Dual study"],
        },
        {
            year: "2023 - 2024",
            title: "Early projects and self-teaching",
            description:
                "Built small tools, a first portfolio, game prototypes, and Discord bots to sharpen my fundamentals and find my style.",
            tags: ["Next.js", "Python", "Discord bots"],
        },
        {
            year: "Now",
            title: "Sharpening product thinking",
            description:
                "Pushing toward cleaner interfaces, stronger motion, and a more intentional way to present my work and progress.",
            tags: ["UI design", "Motion", "Portfolio"],
        },
    ];

    return (
        <section className="route-section" id="experience-details">
            <div className="section__heading">
                <p className="eyebrow">Experience timeline</p>
                <h2>The road I’ve been taking so far.</h2>
            </div>
            <div className="timeline">
                {milestones.map((milestone) => (
                    <article key={milestone.year + milestone.title} className="timeline__item">
                        <div className="timeline__year">{milestone.year}</div>
                        <div className="timeline__content">
                            <strong>{milestone.title}</strong>
                            <p>{milestone.description}</p>
                            <div className="timeline__tags" aria-label={`${milestone.year} highlights`}>
                                {milestone.tags.map((tag) => (
                                    <span key={tag}>{tag}</span>
                                ))}
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}