import Image from "next/image";

export default function AnimeSection() {
    const animes = [
        {
            id: 1,
            title: "1. Sword Art Online",
            description: "One of my first animes that i watched. Still wish that the nearfgear will soon be available in real life.",
            image: "/anime/sword-art-online.png",
        },
        {
            id: 2,
            title: "2. The Angel next door spoils me rotten",
            description: "Wholesome anime about a high school boy and a girl who lives next door. The story is about how they get closer and closer to each other.",
            image: "/anime/angel-next-door.jpg",
        },
        {
            id: 3,
            title: "3. World Trigger",
            description: "Action-packed anime about a group of teenagers who fight against alien invaders.",
            image: "/anime/world-trigger.jpg",
        },
    ];

    return (
        <section className="section" id="anime">
            <div className="section__heading">
                <p className="eyebrow">Animes</p>
                <h2>Animes that i like</h2>
            </div>
            <div className="anime-list">
                {animes.map((anime) => (
                    <article key={anime.id}>
                        <div className="anime-card__image-wrap">
                            <Image
                                src={anime.image}
                                alt={anime.title}
                                fill
                                sizes="(max-width: 980px) 100vw, 33vw"
                                className="anime-card__image"
                            />
                        </div>
                        <div className="anime-card__content">
                            <strong>{anime.title}</strong>
                            <span>{anime.description}</span>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
