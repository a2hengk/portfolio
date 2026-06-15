"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Buttons/button";

const typingPhrases = ["Software Dev.", "Student"];

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

export default function HeroSection() {
    const typingText = useTypingLoop();

    return (
        <section className="hero">
            <div className="hero__content">
                <p className="eyebrow">Portfolio</p>
                <h1 className="hero__title">
                    <span className="hero__title-kicker">Hey I&apos;m</span>
                    <span className="hero__title-name">Lunas</span>
                </h1>
                <p className="hero__typing" aria-live="polite">
                    <span className="hero__typing-label">{typingText}</span>
                    <span className="hero__typing-cursor" aria-hidden="true" />
                </p>
                <p className="lede">
                    My name is Lunas and I’m a dual student at DHBW in Karlsruhe. I build polished web experiences, learn from real work, and keep pushing my portfolio forward.
                </p>
                <div className="hero__actions">
                    <Button href="/experience" variant="primary">
                        Open experience
                    </Button>
                    <Button href="/about" variant="secondary">
                        About me
                    </Button>
                </div>

                <div className="hero__metrics" aria-label="Profile metrics">
                    <div className="hero__metric">
                        <span>Experience</span>
                        <strong>2+ years</strong>
                    </div>
                    <div className="hero__metric">
                        <span>Projects</span>
                        <strong>5+ builds</strong>
                    </div>
                    <div className="hero__metric">
                        <span>Focus</span>
                        <strong>Backend</strong>
                    </div>
                </div>
            </div>

            <aside className="hero__card hero__terminal" aria-label="Live profile terminal">
                <div className="hero__terminal-top">
                    <span className="hero__terminal-dot hero__terminal-dot--accent" aria-hidden="true" />
                    <span className="hero__terminal-dot" aria-hidden="true" />
                    <span className="hero__terminal-dot" aria-hidden="true" />
                    <span className="hero__terminal-title">Portfolio-Terminal</span>
                </div>

                <div className="hero__terminal-body" aria-live="polite">
                    <p className="hero__terminal-line hero__terminal-line--delay-1">&gt; init portfolio --status=live</p>
                    <p className="hero__terminal-line hero__terminal-line--delay-2">&gt; load stack: Next.js, TypeScript, CSS, React</p>
                    <p className="hero__terminal-line hero__terminal-line--delay-3">&gt; sync profile: HerrenknechtAG</p>
                    <p className="hero__terminal-line hero__terminal-line--delay-4">&gt; sync profile: DHBW Karlsruhe</p>
                    <p className="hero__terminal-line hero__terminal-line--ready">All systems operational</p>
                </div>
            </aside>
        </section>
    );
}
