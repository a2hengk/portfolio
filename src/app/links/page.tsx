import PageIntro from "@/components/PageIntro";

export const metadata = {
    title: "Links - Lunas",
    description: "The best places to contact, follow, or message Lunas.",
};

type SocialId = "github" | "discord" | "instagram" | "tiktok";

// Generic line icons (same stroke-and-viewBox recipe as the skill/setup
// icons elsewhere) rather than brand logos, so this grid reads as part of
// the same system instead of a row of imported brand marks.
function SocialIcon({ id }: { id: SocialId }) {
    const shared = {
        className: "link-card__icon",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.8,
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
        "aria-hidden": true,
    };

    switch (id) {
        case "github":
            return (
                <svg {...shared}>
                    <polyline points="8 6 3 12 8 18" />
                    <polyline points="16 6 21 12 16 18" />
                </svg>
            );
        case "discord":
            return (
                <svg {...shared}>
                    <rect x="3" y="6" width="18" height="12" rx="5" />
                    <circle cx="9" cy="12" r="0.6" fill="currentColor" stroke="none" />
                    <circle cx="15" cy="12" r="0.6" fill="currentColor" stroke="none" />
                </svg>
            );
        case "instagram":
            return (
                <svg {...shared}>
                    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17" cy="7" r="0.6" fill="currentColor" stroke="none" />
                </svg>
            );
        case "tiktok":
            return (
                <svg {...shared}>
                    <path d="M12 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
                    <path d="M12 3c.5 2.8 2.6 4.8 5 5" />
                </svg>
            );
        default:
            return null;
    }
}

export default function LinksPage() {
    const socials: {
        id: SocialId;
        name: string;
        handle: string;
        category: string;
        href: string | null;
    }[] = [
        {
            id: "github",
            name: "GitHub",
            handle: "@a2hengk",
            category: "Code",
            href: "https://github.com/a2hengk",
        },
        {
            id: "discord",
            name: "Discord",
            handle: "@lunas3407",
            category: "Chat",
            href: null,
        },
        {
            id: "instagram",
            name: "Instagram",
            handle: "Follow me here",
            category: "Photos",
            href: "https://www.instagram.com/hengkevin1405?igsh=MWF2aWZmb2tqdXhuNw==",
        },
        {
            id: "tiktok",
            name: "TikTok",
            handle: "Follow me here",
            category: "Video",
            href: "https://www.tiktok.com/@lunas.118f20?_r=1&_t=ZG-95j9qvTOsWO",
        },
    ];

    return (
        <main id="top" className="route-page">
            <PageIntro
                sector="05"
                eyebrow="Links"
                title="Want to reach out? Start here."
                description="These are the best places to contact me, follow my work, or send a quick message."
            />

            <section className="route-section">
                <div className="section__heading">
                    <div className="section-marker">
                        <span className="sector-tag">Comms</span>
                        <p className="eyebrow">Socials</p>
                    </div>
                    <h2>I’m happy to hear from you on whichever platform fits best.</h2>
                </div>
                <div className="links-grid">
                    {socials.map((social) => {
                        const content = (
                            <>
                                <SocialIcon id={social.id} />
                                <div className="link-card__body">
                                    <div className="link-card__top">
                                        <strong>{social.name}</strong>
                                        <span className="link-card__category">{social.category}</span>
                                    </div>
                                    <span className="link-card__handle">{social.handle}</span>
                                </div>
                                <span className="link-card__status">
                                    {social.href ? (
                                        <span className="link-card__external" aria-hidden="true">↗</span>
                                    ) : (
                                        <>
                                            <span className="link-card__dot" aria-hidden="true" />
                                            DM direct
                                        </>
                                    )}
                                </span>
                            </>
                        );

                        return social.href ? (
                            <a
                                key={social.id}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link-card"
                            >
                                {content}
                            </a>
                        ) : (
                            <div key={social.id} className="link-card" aria-label={`${social.name}: ${social.handle}, add me directly`}>
                                {content}
                            </div>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}
