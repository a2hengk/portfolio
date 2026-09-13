"use client";

import { useEffect, useState } from "react";

// A stylized (not surveyed) take on the Nürburgring Nordschleife - my
// favorite track. Traced corner-by-corner from an official track map (the
// full ~46-corner sequence, smoothed into a curve) so the silhouette - the
// big loop up top, the Hocheifel squiggle on the right, the narrow run
// down through Döttinger Höhe into the GP-section start/finish loop -
// actually reads as the Nordschleife. Each checkpoint lines up with one
// entry in the timeline below, in the same order you'd hit them on a lap:
// Start/Ziel -> Hatzenbach -> Flugplatz -> Adenauer Forst -> Bergwerk ->
// Karussell -> Döttinger Höhe -> back to Start/Ziel.
const TRACK_PATH =
    "M 191.5 282.5 C 189.7 290.0, 186.8 292.5, 184.0 300.0 C 181.2 307.5, 181.1 318.8, 175.0 327.5 " +
    "C 168.9 336.2, 152.5 352.5, 147.5 352.5 C 142.5 352.5, 148.3 334.2, 145.0 327.5 " +
    "C 141.7 320.8, 131.2 317.5, 127.5 312.5 C 123.8 307.5, 122.5 302.5, 122.5 297.5 " +
    "C 122.5 292.5, 127.5 290.0, 127.5 282.5 C 127.5 275.0, 116.2 256.9, 122.5 252.5 " +
    "C 128.8 248.1, 159.6 260.6, 165.0 256.0 C 170.4 251.4, 168.3 231.8, 155.0 225.0 " +
    "C 141.7 218.2, 88.3 221.2, 85.0 215.0 C 81.7 208.8, 126.7 196.7, 135.0 187.5 " +
    "C 143.3 178.3, 147.5 166.7, 135.0 160.0 C 122.5 153.3, 67.9 152.1, 60.0 147.5 " +
    "C 52.1 142.9, 73.8 135.8, 87.5 132.5 C 101.2 129.2, 140.4 132.5, 142.5 127.5 " +
    "C 144.6 122.5, 102.5 112.1, 100.0 102.5 C 97.5 92.9, 125.4 80.0, 127.5 70.0 " +
    "C 129.6 60.0, 105.4 47.5, 112.5 42.5 C 119.6 37.5, 158.8 43.3, 170.0 40.0 " +
    "C 181.2 36.7, 171.2 22.1, 180.0 22.5 C 188.8 22.9, 209.2 45.0, 222.5 42.5 " +
    "C 235.8 40.0, 250.4 8.3, 260.0 7.5 C 269.6 6.7, 273.3 27.9, 280.0 37.5 " +
    "C 286.7 47.1, 292.9 64.2, 300.0 65.0 C 307.1 65.8, 315.0 41.7, 322.5 42.5 " +
    "C 330.0 43.3, 341.2 71.7, 345.0 70.0 C 348.8 68.3, 342.5 40.4, 345.0 32.5 " +
    "C 347.5 24.6, 349.6 23.3, 360.0 22.5 C 370.4 21.7, 395.8 23.8, 407.5 27.5 " +
    "C 419.2 31.2, 434.2 39.6, 430.0 45.0 C 425.8 50.4, 381.2 55.4, 382.5 60.0 " +
    "C 383.8 64.6, 441.2 66.2, 437.5 72.5 C 433.8 78.8, 370.0 95.8, 360.0 97.5 " +
    "C 350.0 99.2, 380.0 78.8, 377.5 82.5 C 375.0 86.2, 360.8 112.1, 345.0 120.0 " +
    "C 329.2 127.9, 292.9 124.2, 282.5 130.0 C 272.1 135.8, 263.8 152.5, 282.5 155.0 " +
    "C 301.2 157.5, 382.5 142.9, 395.0 145.0 C 407.5 147.1, 366.7 159.2, 357.5 167.5 " +
    "C 348.3 175.8, 353.3 184.2, 340.0 195.0 C 326.7 205.8, 292.9 223.8, 277.5 232.5 " +
    "C 262.1 241.2, 252.9 242.1, 247.5 247.5 C 242.1 252.9, 253.8 263.8, 245.0 265.0 " +
    "C 236.2 266.2, 203.9 252.1, 195.0 255.0 C 186.1 257.9, 193.3 275.0, 191.5 282.5 Z";

const CHECKPOINTS = [
    { id: 1, corner: "Start/Ziel", x: 191.5, y: 282.5 },
    { id: 2, corner: "Hatzenbach", x: 165, y: 256 },
    { id: 3, corner: "Flugplatz", x: 85, y: 215 },
    { id: 4, corner: "Adenauer Forst", x: 100, y: 102.5 },
    { id: 5, corner: "Bergwerk", x: 260, y: 7.5 },
    { id: 6, corner: "Karussell", x: 345, y: 70 },
    { id: 7, corner: "Döttinger Höhe", x: 340, y: 195 },
];

function NordschleifeMap() {
    // SMIL's animateMotion doesn't listen to the CSS reduced-motion
    // override used everywhere else on the site, so it's gated here.
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setAnimate(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    }, []);

    return (
        <div className="track-map">
            <span className="hud-corner hud-corner--tl" aria-hidden="true" />
            <span className="hud-corner hud-corner--tr" aria-hidden="true" />
            <span className="hud-corner hud-corner--bl" aria-hidden="true" />
            <span className="hud-corner hud-corner--br" aria-hidden="true" />

            <svg className="track-map__svg" viewBox="30 -25 440 410" role="img" aria-label="Stylized map of the Nürburgring Nordschleife with 7 checkpoints marking my career timeline">
                <path className="track-map__road" d={TRACK_PATH} />
                <path className="track-map__line" d={TRACK_PATH} />

                {animate ? (
                    <circle r="5" className="track-map__runner">
                        <animateMotion dur="9s" repeatCount="indefinite" path={TRACK_PATH} rotate="auto" />
                    </circle>
                ) : null}

                {CHECKPOINTS.map((cp) => (
                    <g key={cp.id}>
                        <circle
                            cx={cp.x}
                            cy={cp.y}
                            r="12"
                            className={cp.id === 1 ? "track-map__checkpoint track-map__checkpoint--start" : "track-map__checkpoint"}
                        />
                        <text x={cp.x} y={cp.y} className="track-map__checkpoint-label" textAnchor="middle" dominantBaseline="central">
                            {cp.id}
                        </text>
                    </g>
                ))}
            </svg>

            <p className="track-map__caption">Nordschleife · 20.8 km · stylized lap, real corner order</p>
        </div>
    );
}

export default function ExperienceSection() {
    const milestones = [
        {
            checkpoint: 1,
            corner: "Start/Ziel",
            year: "2022",
            title: "Interested in IT",
            description:
                "I was in 9th grade when I first got interested in IT. I started doing internships at local companies to get a feel for the industry and insights into the different roles and responsibilities.",
            tags: ["IT", "Internships", "Exploration"],
        },
        {
            checkpoint: 2,
            corner: "Hatzenbach",
            year: "2023 - 2025",
            title: "Tech. Highschool",
            description:
                "I enrolled in a tech-focused school to get more understanding and got in touch with programming and a lot more of different technologies. I also enrolled to get permission to study at a highschool.",
            tags: ["Tech highschool", "Programming", "Exploration"],
        },
        {
            checkpoint: 3,
            corner: "Flugplatz",
            year: "2024 - 2025",
            title: "Side projects",
            description:
                "I started working on side projects to apply what I learned and to explore my interests further. I built a few projects, including a Discord bot and just small Python scripts to get a better understanding of programming.",
            tags: ["Python", "Discord bots"],
        },
        {
            checkpoint: 4,
            corner: "Adenauer Forst",
            year: "2025",
            title: "Herrenknecht AG",
            description:
                "I applied at Herrenknecht AG as a Dual Student in the field of IT. I got accepted and started working there in July 2025.",
            tags: ["Herrenknecht AG", "Dual Student", "IT"],
        },
        {
            checkpoint: 5,
            corner: "Bergwerk",
            year: "2025 - 2026",
            title: "Dual Student at Herrenknecht AG",
            description:
                "Alongside working at Herrenknecht AG, I was enrolled as a dual student at DHBW Karlsruhe, splitting my time between practical work and theoretical coursework.",
            tags: ["Herrenknecht AG", "DHBW Karlsruhe", "Dual Student"],
        },
        {
            checkpoint: 6,
            corner: "Karussell",
            year: "2026",
            title: "Changing direction",
            description:
                "I left the dual-study program at DHBW Karlsruhe - splitting time between lectures and full-time work wasn't the right fit, so I looked for a path that's more hands-on.",
            tags: ["DHBW Karlsruhe", "Course correction"],
        },
        {
            checkpoint: 7,
            corner: "Döttinger Höhe",
            year: "Sep 2026 - 2028",
            title: "Ausbildung: Anwendungsentwickler",
            description:
                "Starting 1 September 2026, I'm swapping the split dual-study model for a full apprenticeship (Ausbildung) as an Anwendungsentwickler at Herrenknecht AG - full-time and fully hands-on through 2028.",
            tags: ["Herrenknecht AG", "Anwendungsentwickler", "Ausbildung"],
        },
    ];

    return (
        <section className="route-section" id="experience-details">
            <div className="section__heading">
                <div className="section-marker">
                    <span className="sector-tag">Lap: Career</span>
                    <p className="eyebrow">Experience timeline</p>
                </div>
                <h2>The road I’ve been taking so far.</h2>
                <p>
                    Laid out on my favorite circuit, the Nürburgring Nordschleife - each checkpoint below is a corner on the lap, in the real order you'd drive them.
                </p>
            </div>

            <NordschleifeMap />

            <div className="timeline">
                {milestones.map((milestone) => (
                    <article key={milestone.year + milestone.title} className="timeline__item">
                        <div className="timeline__year">
                            {milestone.year}
                            <span className="timeline__checkpoint">CP{milestone.checkpoint} · {milestone.corner}</span>
                        </div>
                        <div className="timeline__content">
                            <strong>{milestone.title}</strong>
                            <p>{milestone.description}</p>
                            <div className="timeline__tags" aria-label={`${milestone.year} highlights`}>
                                {milestone.tags.map((tag) => (
                                    <span key={tag}>{tag}</span>
                                ))}
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
