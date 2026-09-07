export default function ExperienceSection() {
    const milestones = [
        {
            year: "2022",
            title: "Interested in IT",
            description:
                "I was in 9th grade when I first got interested in IT. I started doing internships at local companies to get a feel for the industry and insights into the different roles and responsibilities.",
            tags: ["IT", "Internships", "Exploration"],
        },
        {
            year: "2023 - 2025",
            title: "Tech. Highschool",
            description:
                "I enrolled in a tech-focused school to get more understanding and got in touch with programming and a lot more of different technologies. I also enrolled to get permission to study at a highschool.",
            tags: ["Tech highschool", "Programming", "Exploration"],
        },
        {
            year: "2024 - 2025",
            title: "Side projects",
            description:
                "I started working on side projects to apply what I learned and to explore my interests further. I built a few projects, including a Discord bot and just small Python scripts to get a better understanding of programming.",
            tags: ["Python", "Discord bots"],
        },
        {
            year: "2025",
            title: "Herrenknecht AG",
            description:
                "I applied at Herrenknecht AG as a Dual Student in the field of IT. I got accepted and started working there in July 2025.",
            tags: ["Herrenknecht AG", "Dual Student", "IT"],
        },
        {
            year: "2025 - 2028",
            title: "Dual Student at Herrenknecht AG",
            description:
                "Not only am I working at Herrenknecht AG, I'm also studying in Karlsruhe. I'm gaining practical experience in the field of IT while deepening my theoretical knowledge.",
            tags: ["Herrenknecht AG", "Dual Student", "IT", "Practical Experience"],
        }
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