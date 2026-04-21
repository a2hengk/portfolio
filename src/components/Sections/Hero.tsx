import Button from "@/components/Buttons/button";

export default function HeroSection() {
    return (
        <section className="hero">
            <div className="hero__content">
                <p className="eyebrow">Portfolio of Lunas</p>
                <h1>Heyy i'm Lunas and a Dual Student</h1>
                <p className="lede">
                    I&apos;m a dual student focused on building clean, modern web products with strong UX.
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

            <aside className="hero__card" aria-label="Profile metadata">
                <p className="hero__card-label">Quick metadata</p>
                <div className="hero__card-metric">
                    <strong>Work</strong>
                    <span>Frontend-focused product and portfolio development</span>
                </div>
                <div className="hero__card-metric">
                    <strong>School</strong>
                    <span>Dual study program in software engineering</span>
                </div>
                <div className="hero__card-metric">
                    <strong>Base</strong>
                    <span>Germany</span>
                </div>
                <div className="hero__card-note">
                    Open to internships, freelance projects, and collaboration.
                </div>
            </aside>
        </section>
    );
}
