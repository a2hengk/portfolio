export default function AboutSection() {
    const skillBlocks = [
        {
            id: 1,
            title: "Frontend",
            stack: "Next.js, TypeScript, CSS Modules, Motion",
        },
        {
            id: 2,
            title: "Backend",
            stack: "Node.js APIs, Auth Flows, Data Modeling",
        },
        {
            id: 3,
            title: "Workflow",
            stack: "GitHub, VS Code, Figma, Vercel",
        },
        {
            id: 4,
            title: "Interests",
            stack: "System Design, Automation, Gaming UI",
        },
    ];

    return (
        <section className="section section--about" id="stack">
            <div className="section__heading">
                <p className="eyebrow">Stack and skills</p>
                <h2>The tools and areas I work with most.</h2>
            </div>
            <aside className="about-panel about-panel--skills" aria-label="Skill overview">
                <div className="skill-grid">
                    {skillBlocks.map((skill) => (
                        <div key={skill.id} className="skill-card">
                            <strong>{skill.title}</strong>
                            <span>{skill.stack}</span>
                        </div>
                    ))}
                </div>
            </aside>
        </section>
    );
}
