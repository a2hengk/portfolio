import Button from "@/components/Buttons/button";

export default function AboutSection() {
    const intro = {
        title: "The person behind the code.",
        description:
            "Heyy I'm Kevin 19 years old, studying in a dual system school in Germany where i study Computer Science and work as a software developer. I have a passion for creating and building things, and I love to learn new technologies and improve my skills. I am always looking for new challenges and opportunities to grow as a developer.",
    };

    // Counted straight from the tags on the projects listed on /projects -
    // what actually shows up when something ships, not a claimed skill level.
    const mostUsed = [
        { name: "Next.js", builds: 3, of: 5 },
        { name: "TypeScript", builds: 2, of: 5 },
        { name: "Python", builds: 2, of: 5 },
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

                <div className="skill-bars" aria-label="Most used across my builds">
                    {mostUsed.map((item) => (
                        <div key={item.name}>
                            <div className="skill-bar__label">
                                <strong>{item.name}</strong>
                                <span>{item.builds}/{item.of} builds</span>
                            </div>
                            <div className="skill-bar__track">
                                <div
                                    className="skill-bar__fill"
                                    style={{ width: `${(item.builds / mostUsed[0].builds) * 100}%` }}
                                />
                            </div>
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
