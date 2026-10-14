import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Button from "@/components/Buttons/button";
import PageIntro from "@/components/PageIntro";
import ProjectsSection from "@/components/Sections/Projects";
import { alternatesFor, localizedHref } from "@/i18n/config";
import { getDictionary, hasLocale } from "../dictionaries";

export async function generateMetadata({ params }: PageProps<"/[lang]/projects">): Promise<Metadata> {
    const { lang } = await params;
    if (!hasLocale(lang)) return {};
    const dict = await getDictionary(lang);

    return { ...dict.meta.projects, alternates: alternatesFor(lang, "/projects") };
}

export default async function ProjectsPage({ params }: PageProps<"/[lang]/projects">) {
    const { lang } = await params;
    if (!hasLocale(lang)) notFound();
    const dict = await getDictionary(lang);
    const intro = dict.projects.intro;

    return (
        <main id="top" className="route-page">
            <PageIntro
                sector="03"
                eyebrow={intro.eyebrow}
                title={intro.title}
                description={intro.description}
            />
            <div className="route-inline-actions">
                <Button href={localizedHref(lang, "/links")} variant="primary">
                    {intro.primaryAction}
                </Button>
                <Button href={localizedHref(lang, "/links")} variant="secondary">
                    {intro.secondaryAction}
                </Button>
            </div>
            <ProjectsSection dict={dict.projects} />
        </main>
    );
}
