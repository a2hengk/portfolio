import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Button from "@/components/Buttons/button";
import PageIntro from "@/components/PageIntro";
import ExperienceSection from "@/components/Sections/Experience";
import { alternatesFor, localizedHref } from "@/i18n/config";
import { getDictionary, hasLocale } from "../dictionaries";

export async function generateMetadata({ params }: PageProps<"/[lang]/experience">): Promise<Metadata> {
    const { lang } = await params;
    if (!hasLocale(lang)) return {};
    const dict = await getDictionary(lang);

    return { ...dict.meta.experience, alternates: alternatesFor(lang, "/experience") };
}

export default async function ExperiencePage({ params }: PageProps<"/[lang]/experience">) {
    const { lang } = await params;
    if (!hasLocale(lang)) notFound();
    const dict = await getDictionary(lang);
    const intro = dict.experience.intro;

    return (
        <main id="top" className="route-page">
            <PageIntro
                sector="02"
                eyebrow={intro.eyebrow}
                title={intro.title}
                description={intro.description}
            />
            <div className="route-inline-actions">
                <Button href={localizedHref(lang, "/projects")} variant="primary">
                    {intro.primaryAction}
                </Button>
                <Button href={localizedHref(lang, "/about")} variant="secondary">
                    {intro.secondaryAction}
                </Button>
            </div>
            <ExperienceSection dict={dict.experience} />
        </main>
    );
}
