import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import GamesSection from "@/components/Sections/Games";
import AnimeSection from "@/components/Sections/Anime";
import { alternatesFor } from "@/i18n/config";
import { getDictionary, hasLocale } from "../dictionaries";

export async function generateMetadata({ params }: PageProps<"/[lang]/off-duty">): Promise<Metadata> {
    const { lang } = await params;
    if (!hasLocale(lang)) return {};
    const dict = await getDictionary(lang);

    return { ...dict.meta.offDuty, alternates: alternatesFor(lang, "/off-duty") };
}

export default async function OffDutyPage({ params }: PageProps<"/[lang]/off-duty">) {
    const { lang } = await params;
    if (!hasLocale(lang)) notFound();
    const dict = await getDictionary(lang);
    const intro = dict.offDuty.intro;

    return (
        <main id="top" className="route-page">
            <PageIntro
                sector="04"
                eyebrow={intro.eyebrow}
                title={intro.title}
                description={intro.description}
            />
            <GamesSection dict={dict.offDuty.games} />
            <AnimeSection dict={dict.offDuty.anime} />
        </main>
    );
}
