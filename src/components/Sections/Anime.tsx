import Image from "next/image";
import type { Dictionary } from "@/app/[lang]/dictionaries";

export default function AnimeSection({ dict }: { dict: Dictionary["offDuty"]["anime"] }) {
    // Titles are the shows' names and stay as they are; descriptions come
    // from the dictionary by id.
    const animes = [
        {
            id: 1,
            title: "1. Sword Art Online",
            description: dict.descriptions["1"],
            image: "/anime/sword-art-online.png",
        },
        {
            id: 2,
            title: "2. The Angel next door spoils me rotten",
            description: dict.descriptions["2"],
            image: "/anime/angel-next-door.jpg",
        },
        {
            id: 3,
            title: "3. World Trigger",
            description: dict.descriptions["3"],
            image: "/anime/world-trigger.jpg",
        },
    ];

    return (
        <section className="route-section" id="anime">
            <div className="section__heading">
                <div className="section-marker">
                    <span className="sector-tag">{dict.tag}</span>
                    <p className="eyebrow">{dict.eyebrow}</p>
                </div>
                <h2>{dict.title}</h2>
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
