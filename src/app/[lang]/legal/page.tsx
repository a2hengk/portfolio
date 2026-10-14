import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Button from "@/components/Buttons/button";
import PageIntro from "@/components/PageIntro";
import { alternatesFor, localizedHref } from "@/i18n/config";
import { getDictionary, hasLocale } from "../dictionaries";

export async function generateMetadata({ params }: PageProps<"/[lang]/legal">): Promise<Metadata> {
    const { lang } = await params;
    if (!hasLocale(lang)) return {};
    const dict = await getDictionary(lang);

    return { ...dict.meta.legal, alternates: alternatesFor(lang, "/legal") };
}

export default async function LegalPage({ params }: PageProps<"/[lang]/legal">) {
    const { lang } = await params;
    if (!hasLocale(lang)) notFound();
    const dict = await getDictionary(lang);
    const t = dict.legal;

    return (
        <main id="top" className="route-page">
            <PageIntro
                eyebrow={t.intro.eyebrow}
                title={t.intro.title}
                description={t.intro.description}
            />

            <section className="route-section" id="impressum">
                <div className="section__heading">
                    <p className="eyebrow">{t.impressum.eyebrow}</p>
                    <h2>{t.impressum.title}</h2>
                </div>
                <p>Kevin</p>
                <p>
                    {t.impressum.contact} <a href="mailto:heng.kevin05@gmail.com">heng.kevin05@gmail.com</a>
                </p>
            </section>

            <section className="route-section" id="privacy">
                <div className="section__heading">
                    <p className="eyebrow">{t.privacy.eyebrow}</p>
                    <h2>{t.privacy.title}</h2>
                </div>
                <p>
                    {t.privacy.intro}
                </p>
                <p>
                    <strong>{t.privacy.messagesTitle}</strong> {t.privacy.messagesText}
                </p>
                <p>
                    <strong>{t.privacy.discordTitle}</strong> {t.privacy.discordBefore}{" "}
                    <a href="https://discord.com/privacy" target="_blank" rel="noopener noreferrer">
                        {t.privacy.discordLink}
                    </a>
                    {t.privacy.discordAfter.startsWith(".") ? "" : " "}
                    {t.privacy.discordAfter}
                </p>
                <p>
                    <strong>{t.privacy.spamTitle}</strong> {t.privacy.spamBefore}{" "}
                    <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">
                        {t.privacy.spamLink}
                    </a>
                    {t.privacy.spamAfter}
                </p>
                <p>
                    {t.privacy.removal}
                </p>
            </section>

            <section className="route-section" id="rights">
                <div className="section__heading">
                    <p className="eyebrow">{t.rights.eyebrow}</p>
                    <h2>{t.rights.title}</h2>
                </div>
                <p>
                    {t.rights.text}
                </p>
            </section>

            <div className="route-inline-actions">
                <Button href={localizedHref(lang, "/")} variant="secondary">
                    {t.back}
                </Button>
            </div>
        </main>
    );
}
