import Image from "next/image";

type Mode = "Competitive" | "For fun" | "Survival + Creative" | "Chilling";

// Same status-badge chip used for project status on /projects, just
// re-mapped to game modes so the two card grids read as one system.
const MODE_VARIANT: Record<Mode, "live" | "progress" | "featured"> = {
    Competitive: "progress",
    "For fun": "live",
    "Survival + Creative": "featured",
    Chilling: "featured",
};

export default function GamesSection() {
    const games: { id: number; title: string; mode: Mode; image: string }[] = [
        {
            id: 1,
            title: "Assetto Corsa Competizione",
            mode: "Competitive",
            image: "/games/assetto-corsa-competizione.jpg",
        },
        {
            id: 2,
            title: "Valorant",
            mode: "For fun",
            image: "/games/valorant.png",
        },
        {
            id: 3,
            title: "Minecraft",
            mode: "Survival + Creative",
            image: "/games/minecraft.png",
        },
        {
            id: 4,
            title: "Apex Legends",
            mode: "Competitive",
            image: "/games/apex-legends.png",
        },
        {
            id: 5,
            title: "League of Legends",
            mode: "For fun",
            image: "/games/league-of-legends.png",
        },
        {
            id: 6,
            title: "TheCrew 2",
            mode: "Chilling",
            image: "/games/the-crew-2.png",
        },
    ];

    return (
        <section className="route-section" id="games">
            <div className="section__heading">
                <div className="section-marker">
                    <span className="sector-tag">Pit lane</span>
                    <p className="eyebrow">Games I play</p>
                </div>
                <h2>My current rotation outside coding hours.</h2>
                <p>Lately, I've been really interested in Sim Racing and Motorsport in general. I love the realism and competition that comes with it. Outside that, I enjoy playing a variety of games to unwind and have fun.</p>
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
                                {game.mode}
                            </span>
                            <h3>{game.title}</h3>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
