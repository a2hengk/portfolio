import Button from "@/components/Buttons/button";

export default function AboutSection() {
    const intro = {
        title: "The person behind the code.",
        description:
            "Heyy I'm Kevin 19 years old, studying in a dual system school in Germany where i study Computer Science and work as a software developer. I have a passion for creating and building things, and I love to learn new technologies and improve my skills. I am always looking for new challenges and opportunities to grow as a developer.",
    };

    const quickFacts = [
        { label: "Company", value: "Herrenknecht AG" },
        { label: "Studying at", value: "DHBW Karlsruhe" },
        { label: "Role", value: "Dual Student" },
    ];

    const skillBlocks = [
        {
            id: 1,
            title: "Frontend",
            stack: "Next.js, TypeScript, React, HTML, CSS",
        },
        {
            id: 2,
            title: "Backend",
            stack: "Node.js, Python, SQL, Docker, C#, Java, Git, WSL2, REST APIs",
        },
        {
            id: 3,
            title: "Workflow",
            stack: "GitHub, VS Code, Cloudflare, Vercel",
        },
        {
            id: 4,
            title: "Interests",
            stack: "System Design, Automation, Game Development, UI/UX",
        },
    ];

    return (
        <section className="section section--about" id="about">
            <div className="section__heading">
                <p className="eyebrow">About me</p>
                <h2>{intro.title}</h2>
            </div>

            <div className="about-intro">
                <p>{intro.description}</p>
            </div>

            <div className="hero__metrics" aria-label="Quick facts">
                {quickFacts.map((fact) => (
                    <div key={fact.label} className="hero__metric">
                        <span>{fact.label}</span>
                        <strong>{fact.value}</strong>
                    </div>
                ))}
            </div>

            <aside className="about-panel about-panel--skills" aria-label="Skill overview">
                <div className="section__heading">
                    <p className="eyebrow">Stack and skills</p>
                    <h2>The tools and areas I work with most.</h2>
                </div>
                <div className="skill-grid">
                    {skillBlocks.map((skill) => (
                        <div key={skill.id} className="skill-card">
                            <strong>{skill.title}</strong>
                            <span>{skill.stack}</span>
                        </div>
                    ))}
                </div>
            </aside>

            <div className="subsection">
                <div className="section__heading">
                    <p className="eyebrow">Beyond the code</p>
                    <h2>What I do when I log off.</h2>
                </div>
                <p>
                    Outside of work I'm usually deep in Sim Racing and Motorsport, working through a rotating cast of games, or catching up on an anime.
                </p>
                <Button href="/off-duty" variant="secondary">
                    See what I&apos;m into off duty
                </Button>
            </div>
        </section>
    );
}
