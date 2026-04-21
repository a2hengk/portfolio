import Image from "next/image";

export default function GamesSection() {
    const games = [
        {
            id: 1,
            title: "Valorant",
            mode: "Competitive",
            image: "/games/valorant.png",
        },
        {
            id: 2,
            title: "League of Legends",
            mode: "For fun",
            image: "/games/league-of-legends.png",
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
            title: "Overwatch 2",
            mode: "For fun",
            image: "/games/overwatch.png",
        },
        {
            id: 6,
            title: "TheCrew 2",
            mode: "Chilling",
            image: "/games/the-crew-2.png",
        },
    ];

    return (
        <section className="section" id="games">
            <div className="section__heading">
                <p className="eyebrow">Games I play</p>
                <h2>My current rotation outside coding hours.</h2>
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
                            <p className="game-card__mode">{game.mode}</p>
                            <h3>{game.title}</h3>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
