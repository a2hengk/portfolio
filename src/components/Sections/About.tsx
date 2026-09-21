import Button from "@/components/Buttons/button";

type SkillVariant = "frontend" | "backend" | "workflow" | "interests";

// Small line icons, one per skill category - purely decorative, no
// implied proficiency level (see the skill-bars comment below for why
// that matters here).
function SkillIcon({ variant }: { variant: SkillVariant }) {
    const shared = {
        className: "skill-card__icon",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.8,
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
        "aria-hidden": true,
    };

    switch (variant) {
        case "frontend":
            return (
                <svg {...shared}>
                    <polyline points="8 6 3 12 8 18" />
                    <polyline points="16 6 21 12 16 18" />
                </svg>
            );
        case "backend":
            return (
                <svg {...shared}>
                    <rect x="3" y="4" width="18" height="6" rx="1.5" />
                    <rect x="3" y="14" width="18" height="6" rx="1.5" />
                    <circle cx="7" cy="7" r="0.6" fill="currentColor" stroke="none" />
                    <circle cx="7" cy="17" r="0.6" fill="currentColor" stroke="none" />
                </svg>
            );
        case "workflow":
            return (
                <svg {...shared}>
                    <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4l-6 6 2 2 6-6a4 4 0 0 0 5.4-5.4l-2.2 2.2-2-2z" />
                </svg>
            );
        case "interests":
            return (
                <svg {...shared}>
                    <circle cx="12" cy="12" r="9" />
                    <circle cx="12" cy="12" r="2.2" />
                    <path d="M12 3v6.8M4.5 16.5l5-3.4M19.5 16.5l-5-3.4" />
                </svg>
            );
        default:
            return null;
    }
}

export default function AboutSection() {
    const intro = {
        title: "The person behind the code.",
        description:
            "Heyy I'm Kevin, 19 years old, doing my Ausbildung as a Fachinformatiker für Anwendungsentwicklung at Herrenknecht AG in Germany. I have a passion for creating and building things, and I love to learn new technologies and improve my skills. I am always looking for new challenges and opportunities to grow as a developer.",
    };

    // Counted straight from the tags on the projects listed on /projects -
    // what actually shows up when something ships, not a claimed skill level.
    const mostUsed = [
        { name: "Next.js", builds: 3, of: 5 },
        { name: "TypeScript", builds: 2, of: 5 },
        { name: "Python", builds: 2, of: 5 },
    ];

    // Skill categories, framed as gears in a sequential gearbox - shifting
    // up through Frontend -> Backend -> Workflow -> Interests. Each tool
    // is its own chip rather than one flat sentence of text.
    const skillBlocks: {
        id: number;
        gear: string;
        variant: SkillVariant;
        title: string;
        tags: string[];
    }[] = [
        {
            id: 1,
            gear: "1st",
            variant: "frontend",
            title: "Frontend",
            tags: ["Next.js", "TypeScript", "React", "HTML", "CSS"],
        },
        {
            id: 2,
            gear: "2nd",
            variant: "backend",
            title: "Backend",
            tags: ["Node.js", "Python", "SQL", "Docker", "C#", "Java", "Git", "WSL2", "REST APIs"],
        },
        {
            id: 3,
            gear: "3rd",
            variant: "workflow",
            title: "Workflow",
            tags: ["GitHub", "VS Code", "Cloudflare", "Vercel"],
        },
        {
            id: 4,
            gear: "4th",
            variant: "interests",
            title: "Interests",
            tags: ["System Design", "Automation", "Game Development", "UI/UX"],
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
                    <div className="section-marker">
                        <span className="sector-tag">Gearbox</span>
                        <p className="eyebrow">Stack and skills</p>
                    </div>
                    <h2>The tools and areas I work with most.</h2>
                    <div className="tick-divider" aria-hidden="true" />
                </div>
                <div className="skill-grid">
                    {skillBlocks.map((skill) => (
                        <div key={skill.id} className={`skill-card skill-card--${skill.variant}`}>
                            <div className="skill-card__top">
                                <span className="skill-card__gear">
                                    <span>{skill.gear}</span> gear
                                </span>
                                <SkillIcon variant={skill.variant} />
                            </div>
                            <strong>{skill.title}</strong>
                            <div className="skill-card__tags" aria-label={`${skill.title} tools`}>
                                {skill.tags.map((tag) => (
                                    <span key={tag}>{tag}</span>
                                ))}
                            </div>
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
