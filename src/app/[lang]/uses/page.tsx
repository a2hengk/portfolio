import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import UsesSection from "@/components/Sections/Uses";
import { alternatesFor } from "@/i18n/config";
import { getDictionary, hasLocale } from "../dictionaries";

export async function generateMetadata({ params }: PageProps<"/[lang]/uses">): Promise<Metadata> {
    const { lang } = await params;
    if (!hasLocale(lang)) return {};
    const dict = await getDictionary(lang);

    return { ...dict.meta.uses, alternates: alternatesFor(lang, "/uses") };
}

export default async function UsesPage({ params }: PageProps<"/[lang]/uses">) {
    const { lang } = await params;
    if (!hasLocale(lang)) notFound();
    const dict = await getDictionary(lang);
    const intro = dict.uses.intro;

    return (
        <main id="top" className="route-page">
            <PageIntro
                sector="06"
                eyebrow={intro.eyebrow}
                title={intro.title}
                description={intro.description}
            />

            <UsesSection dict={dict.uses} />
        </main>
    );
}
