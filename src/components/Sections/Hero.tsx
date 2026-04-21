import Button from "@/components/Buttons/button";

export default function HeroSection() {
    return (
        <section className="hero">
            <div className="hero__content">
                <p className="eyebrow">Portfolio of Lunas</p>
                <h1>Heyy i'm Lunas and a Dual Student</h1>
                <p className="lede">
                    I build polished, story-driven portfolio experiences with clear structure,
                    strong typography, and a focus on the details that make a first impression stick.
                </p>
                <div className="hero__actions">
                    <Button href="#projects" variant="primary">
                        View projects
                    </Button>
                    <Button href="#contact" variant="secondary">
                        Let&apos;s talk
                    </Button>
                </div>
            </div>

            <aside className="hero__card" aria-label="Profile summary">
                <p className="hero__card-label">Available for freelance and product work</p>
                <div className="hero__card-metric">
                    <strong>3+</strong>
                    <span>years exploring frontend craft</span>
                </div>
                <div className="hero__card-metric">
                    <strong>Next.js</strong>
                    <span>the stack behind this site</span>
                </div>
                <div className="hero__card-note">
                    Focused on clean hierarchy, thoughtful motion, and concise storytelling.
                </div>
            </aside>
        </section>
    );
}
