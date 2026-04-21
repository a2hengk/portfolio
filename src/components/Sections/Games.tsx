export default function GamesSection() {
    const games = [
        {
            id: 1,
            title: "Valorant",
            mode: "Competitive",
            note: "Aiming, comms, and fast decision-making.",
        },
        {
            id: 2,
            title: "League of Legends",
            mode: "Ranked / Flex",
            note: "Macro-focused games with team coordination.",
        },
        {
            id: 3,
            title: "Minecraft",
            mode: "Survival + Creative",
            note: "Building systems, farms, and server ideas.",
        },
        {
            id: 4,
            title: "EA FC",
            mode: "Ultimate Team",
            note: "Quick sessions and weekend grind.",
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
                        <p className="game-card__mode">{game.mode}</p>
                        <h3>{game.title}</h3>
                        <p>{game.note}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}
