"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Buttons/button";
import BmwDriveBy from "@/components/Effects/BmwDriveBy";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { localizedHref, type Locale } from "@/i18n/config";

const typingPhrases = ["Fachinformatiker für Anwendungsentwicklung", "FIAE"];

function useTypingLoop() {
    const [text, setText] = useState(typingPhrases[0]);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout> | undefined;
        let phraseIndex = 0;
        let charIndex = typingPhrases[0].length;
        let isDeleting = true;

        const step = () => {
            const currentPhrase = typingPhrases[phraseIndex];
            const nextText = isDeleting ? currentPhrase.slice(0, charIndex - 1) : currentPhrase.slice(0, charIndex + 1);

            charIndex = isDeleting ? charIndex - 1 : charIndex + 1;
            setText(nextText);

            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                timer = setTimeout(step, 1200);
                return;
            }

            if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % typingPhrases.length;
                timer = setTimeout(step, 250);
                return;
            }

            timer = setTimeout(step, isDeleting ? 65 : 95);
        };

        timer = setTimeout(step, 1400);

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, []);

    return text;
}

export default function HeroSection({ lang, dict }: { lang: Locale; dict: Dictionary["home"]["hero"] }) {
    const typingText = useTypingLoop();

    return (
        <section className="hero">
            <span className="livery-stripe livery-stripe--1" aria-hidden="true" />
            <span className="livery-stripe livery-stripe--2" aria-hidden="true" />
            <span className="livery-stripe livery-stripe--3" aria-hidden="true" />
            <span className="livery-stripe livery-stripe--4" aria-hidden="true" />

            <svg className="circuit-line" style={{ right: "-40px", bottom: "-30px", width: "640px", height: "420px" }} viewBox="0 0 640 420" fill="none" aria-hidden="true">
                <path d="M40 340 C 40 250, 120 210, 200 230 C 280 250, 270 320, 350 335 C 430 350, 480 300, 450 235 C 425 180, 350 185, 325 130 C 305 88, 345 45, 405 55 C 480 68, 495 145, 570 160 C 615 169, 625 205, 585 225 C 545 245, 520 210, 480 220" stroke="var(--text)" strokeWidth="3" strokeLinecap="round" />
                <circle cx="40" cy="340" r="5" fill="var(--text)" />
                <circle cx="480" cy="220" r="5" fill="var(--text)" />
            </svg>

            <div className="hero__content">
                <div className="section-marker">
                    <span className="sector-tag">Sector 00</span>
                    <p className="eyebrow">{dict.eyebrow}</p>
                </div>
                <h1 className="hero__title">
                    <span className="hero__title-kicker">{dict.kicker}</span>
                    <span className="hero__title-name glitch" data-text="Lunas">Lunas</span>
                </h1>
                <p className="hero__typing" aria-live="polite">
                    <span className="hero__typing-label">{typingText}</span>
                    <span className="hero__typing-cursor" aria-hidden="true" />
                </p>
                <p className="lede">
                    {dict.lede}
                </p>
                <div className="hero__actions">
                    <Button href={localizedHref(lang, "/experience")} variant="primary">
                        {dict.primaryAction}
                    </Button>
                    <Button href={localizedHref(lang, "/about")} variant="secondary">
                        {dict.secondaryAction}
                    </Button>
                </div>

                <div className="hero__metrics" aria-label={dict.metricsAria}>
                    <div className="hero__metric">
                        <span>{dict.metrics.companyLabel}</span>
                        <strong>{dict.metrics.companyValue} <span className="stat-figure">2025</span></strong>
                    </div>
                    <div className="hero__metric">
                        <span>{dict.metrics.projectsLabel}</span>
                        <strong><span className="stat-figure">5</span> {dict.metrics.projectsValue}</strong>
                    </div>
                    <div className="hero__metric">
                        <span>{dict.metrics.focusLabel}</span>
                        <strong>{dict.metrics.focusValue}</strong>
                    </div>
                </div>
            </div>

            <aside className="hero__card hero__terminal" aria-label={dict.terminalAria}>
                <span className="hud-corner hud-corner--tl" aria-hidden="true" />
                <span className="hud-corner hud-corner--tr" aria-hidden="true" />
                <span className="hud-corner hud-corner--bl" aria-hidden="true" />
                <span className="hud-corner hud-corner--br" aria-hidden="true" />

                <div className="hero__terminal-top">
                    <div className="start-lights" aria-hidden="true">
                        <span className="start-light" />
                        <span className="start-light" />
                        <span className="start-light" />
                        <span className="start-light" />
                        <span className="start-light" />
                    </div>
                    <span className="hero__terminal-title">{dict.terminalTitle}</span>
                </div>

                <div className="tick-divider" aria-hidden="true" />

                <div className="hero__terminal-body" aria-live="polite">
                    <p className="hero__terminal-line hero__terminal-line--delay-1">
                        <span>&gt; stack</span>
                        <span>Next.js · TS · React</span>
                    </p>
                    <p className="hero__terminal-line hero__terminal-line--delay-2">
                        <span>&gt; base</span>
                        <span>Herrenknecht AG</span>
                    </p>
                    <p className="hero__terminal-line hero__terminal-line--delay-3">
                        <span>&gt; training</span>
                        <span>Fachinformatiker '28</span>
                    </p>
                    <p className="hero__terminal-line hero__terminal-line--ready">
                        <span>&gt; status</span>
                        <span className="status-badge status-badge--live">
                            <span className="status-badge__dot" />
                            {dict.status}
                        </span>
                    </p>
                </div>
            </aside>

            <BmwDriveBy />
        </section>
    );
}
