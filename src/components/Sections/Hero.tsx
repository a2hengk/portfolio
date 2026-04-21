import Button from "@/components/Buttons/button";

export default function HeroSection() {
    return (
        <section className="hero">
            <div className="hero__content">
                <p className="eyebrow">Portfolio of Lunas</p>
                <h1>Heyy i'm Lunas and a Dual Student</h1>
                <p className="lede">
                    My name is Lunas and I'm a dual student at DHBW in Karlsruhe. I created this Portfolio as a Project for my studies and just share some insight about myself :D
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
                    <span>I'm working at Herrenknecht AG as Software Developer :D</span>
                </div>
                <div className="hero__card-metric">
                    <strong>School</strong>
                    <span>I study at DHBW in Karlsruhe.</span>
                </div>
                <div className="hero__card-metric">
                    <strong>Age</strong>
                    <span>I'm currently 18 years old and will be 19 soon!</span>
                </div>
                <div className="hero__card-note">
                    Feel free to reach out if you have any questions or project ideas!
                </div>
            </aside>
        </section>
    );
}
