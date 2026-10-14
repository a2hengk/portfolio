import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import { alternatesFor, fill } from "@/i18n/config";
import { getDictionary, hasLocale } from "../dictionaries";

export async function generateMetadata({ params }: PageProps<"/[lang]/links">): Promise<Metadata> {
    const { lang } = await params;
    if (!hasLocale(lang)) return {};
    const dict = await getDictionary(lang);

    return { ...dict.meta.links, alternates: alternatesFor(lang, "/links") };
}

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

export default async function LinksPage({ params }: PageProps<"/[lang]/links">) {
    const { lang } = await params;
    if (!hasLocale(lang)) notFound();
    const dict = await getDictionary(lang);
    const t = dict.links;

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
            category: t.categories.github,
            href: "https://github.com/a2hengk",
        },
        {
            id: "discord",
            name: "Discord",
            handle: "@lunas3407",
            category: t.categories.discord,
            href: null,
        },
        {
            id: "instagram",
            name: "Instagram",
            handle: t.followMe,
            category: t.categories.instagram,
            href: "https://www.instagram.com/hengkevin1405?igsh=MWF2aWZmb2tqdXhuNw==",
        },
        {
            id: "tiktok",
            name: "TikTok",
            handle: t.followMe,
            category: t.categories.tiktok,
            href: "https://www.tiktok.com/@lunas.118f20?_r=1&_t=ZG-95j9qvTOsWO",
        },
    ];

    return (
        <main id="top" className="route-page">
            <PageIntro
                sector="05"
                eyebrow={t.intro.eyebrow}
                title={t.intro.title}
                description={t.intro.description}
            />

            <section className="route-section">
                <div className="section__heading">
                    <div className="section-marker">
                        <span className="sector-tag">{t.tag}</span>
                        <p className="eyebrow">{t.eyebrow}</p>
                    </div>
                    <h2>{t.title}</h2>
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
                                            {t.dmDirect}
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
                            <div key={social.id} className="link-card" aria-label={fill(t.directAria, { name: social.name, handle: social.handle })}>
                                {content}
                            </div>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}
