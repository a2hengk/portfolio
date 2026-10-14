import Image from "next/image";
import type { Dictionary } from "@/app/[lang]/dictionaries";

// Keys into the dictionary's offDuty.games.modes.
type Mode = keyof Dictionary["offDuty"]["games"]["modes"];

// Same status-badge chip used for project status on /projects, just
// re-mapped to game modes so the two card grids read as one system.
const MODE_VARIANT: Record<Mode, "live" | "progress" | "featured"> = {
    competitive: "progress",
    forFun: "live",
    survivalCreative: "featured",
    chilling: "featured",
};

export default function GamesSection({ dict }: { dict: Dictionary["offDuty"]["games"] }) {
    const games: { id: number; title: string; mode: Mode; image: string }[] = [
        {
            id: 1,
            title: "Assetto Corsa Competizione",
            mode: "competitive",
            image: "/games/assetto-corsa-competizione.jpg",
        },
        {
            id: 2,
            title: "Valorant",
            mode: "forFun",
            image: "/games/valorant.png",
        },
        {
            id: 3,
            title: "Minecraft",
            mode: "survivalCreative",
            image: "/games/minecraft.png",
        },
        {
            id: 4,
            title: "Apex Legends",
            mode: "competitive",
            image: "/games/apex-legends.png",
        },
        {
            id: 5,
            title: "League of Legends",
            mode: "forFun",
            image: "/games/league-of-legends.png",
        },
        {
            id: 6,
            title: "TheCrew 2",
            mode: "chilling",
            image: "/games/the-crew-2.png",
        },
    ];

    return (
        <section className="route-section" id="games">
            <div className="section__heading">
                <div className="section-marker">
                    <span className="sector-tag">{dict.tag}</span>
                    <p className="eyebrow">{dict.eyebrow}</p>
                </div>
                <h2>{dict.title}</h2>
                <p>{dict.text}</p>
            </div>
            <div className="games-grid">
                {games.map((game) => (
                    <article key={game.id} className="game-card">
                        <div className="game-card__image-wrap">
                            <Image
                                src={game.image}
                                alt={game.title}
                                fill
                                sizes="(max-width: 980px) 100vw, 33vw"
                                className="game-card__image"
                            />
                        </div>
                        <div className="game-card__content">
                            <span className={`status-badge status-badge--${MODE_VARIANT[game.mode]}`}>
                                <span className="status-badge__dot" aria-hidden="true" />
                                {dict.modes[game.mode]}
                            </span>
                            <h3>{game.title}</h3>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
