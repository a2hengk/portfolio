import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Button from "@/components/Buttons/button";
import PageIntro from "@/components/PageIntro";
import AboutSection from "@/components/Sections/About";
import { alternatesFor, localizedHref } from "@/i18n/config";
import { getDictionary, hasLocale } from "../dictionaries";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
    const { lang } = await params;
    if (!hasLocale(lang)) return {};
    const dict = await getDictionary(lang);

    return { ...dict.meta.about, alternates: alternatesFor(lang, "/about") };
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
    const { lang } = await params;
    if (!hasLocale(lang)) notFound();
    const dict = await getDictionary(lang);
    const intro = dict.about.intro;

    return (
        <main id="top" className="route-page">
            <PageIntro
                sector="01"
                eyebrow={intro.eyebrow}
                title={intro.title}
                description={intro.description}
            />
            <div className="route-inline-actions">
                <Button href={localizedHref(lang, "/experience")} variant="primary">
                    {intro.primaryAction}
                </Button>
                <Button href={localizedHref(lang, "/projects")} variant="secondary">
                    {intro.secondaryAction}
                </Button>
            </div>
            <AboutSection lang={lang} dict={dict.about} />
        </main>
    );
}
