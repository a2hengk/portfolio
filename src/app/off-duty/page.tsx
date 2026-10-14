import PageIntro from "@/components/PageIntro";
import GamesSection from "@/components/Sections/Games";
import AnimeSection from "@/components/Sections/Anime";
import StartLights from "@/components/Sections/StartLights";
import { getLeaderboard, type LeaderboardEntry } from "@/lib/reaction-leaderboard";

export const metadata = {
    title: "Off Duty - Lunas",
    description: "The games I play, the animes I keep coming back to, and a start-lights reaction test.",
};

// The leaderboard is live data, same as the guestbook.
export const dynamic = "force-dynamic";

async function loadLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
        return await getLeaderboard();
    } catch {
        // DB down shouldn't take the whole page with it - the game still
        // runs, it just starts with an empty board.
        return [];
    }
}

export default async function OffDutyPage() {
    const leaderboard = await loadLeaderboard();

    return (
        <main id="top" className="route-page">
            <PageIntro
                sector="04"
                eyebrow="Off duty"
                title="What I'm into when I log off."
                description="Sim racing, a rotating cast of games, and a few animes I keep coming back to."
            />
            <GamesSection />
            <StartLights initialLeaderboard={leaderboard} />
            <AnimeSection />
        </main>
    );
}
