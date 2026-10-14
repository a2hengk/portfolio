import PageIntro from "@/components/PageIntro";
import GamesSection from "@/components/Sections/Games";
import AnimeSection from "@/components/Sections/Anime";

export const metadata = {
    title: "Off Duty - Lunas",
    description: "The games I play and the animes I keep coming back to when I log off.",
};

export default function OffDutyPage() {
    return (
        <main id="top" className="route-page">
            <PageIntro
                sector="04"
                eyebrow="Off duty"
                title="What I'm into when I log off."
                description="Sim racing, a rotating cast of games, and a few animes I keep coming back to."
            />
            <GamesSection />
            <AnimeSection />
        </main>
    );
}
