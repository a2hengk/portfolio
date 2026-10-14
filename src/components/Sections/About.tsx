import Button from "@/components/Buttons/button";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { fill, localizedHref, type Locale } from "@/i18n/config";

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

export default function AboutSection({ lang, dict }: { lang: Locale; dict: Dictionary["about"] }) {

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
            ...dict.skills.frontend,
            variant: "frontend",
            tags: ["Next.js", "TypeScript", "React", "HTML", "CSS"],
        },
        {
            id: 2,
            ...dict.skills.backend,
            variant: "backend",
            tags: ["Node.js", "Python", "Postgres", "Drizzle ORM", "Docker", "C#", "Java", "REST APIs"],
        },
        {
            id: 3,
            ...dict.skills.workflow,
            variant: "workflow",
            tags: ["Git", "GitHub", "VS Code", "WSL2", "Cloudflare", "Vercel"],
        },
        {
            id: 4,
            // Interest tags are plain words, so they're translated too.
            ...dict.skills.interests,
            variant: "interests",
        },
    ];

    return (
        <section className="section section--about" id="about">
            <div className="section__heading">
                <p className="eyebrow">{dict.eyebrow}</p>
                <h2>{dict.title}</h2>
            </div>

            <div className="about-intro">
                <p>{dict.description}</p>
            </div>

            <aside className="about-panel about-panel--skills" aria-label={dict.skillsAria}>
                <div className="section__heading">
                    <div className="section-marker">
                        <span className="sector-tag">{dict.skillsTag}</span>
                        <p className="eyebrow">{dict.skillsEyebrow}</p>
                    </div>
                    <h2>{dict.skillsTitle}</h2>
                    <div className="tick-divider" aria-hidden="true" />
                </div>
                <div className="skill-grid">
                    {skillBlocks.map((skill) => (
                        <div key={skill.id} className={`skill-card skill-card--${skill.variant}`}>
                            <div className="skill-card__top">
                                <span className="skill-card__gear">
                                    <span>{skill.gear}</span> {dict.gear}
                                </span>
                                <SkillIcon variant={skill.variant} />
                            </div>
                            <strong>{skill.title}</strong>
                            <div className="skill-card__tags" aria-label={fill(dict.toolsAria, { title: skill.title })}>
                                {skill.tags.map((tag) => (
                                    <span key={tag}>{tag}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="skill-bars" aria-label={dict.barsAria}>
                    {mostUsed.map((item) => (
                        <div key={item.name}>
                            <div className="skill-bar__label">
                                <strong>{item.name}</strong>
                                <span>{fill(dict.buildsOf, { builds: item.builds, of: item.of })}</span>
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
                    <p className="eyebrow">{dict.offDutyEyebrow}</p>
                    <h2>{dict.offDutyTitle}</h2>
                </div>
                <p>
                    {dict.offDutyText}
                </p>
                <Button href={localizedHref(lang, "/off-duty")} variant="secondary">
                    {dict.offDutyAction}
                </Button>
            </div>
        </section>
    );
}
