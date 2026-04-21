import Button from "@/components/Buttons/button";

export default function ContactSection() {
    return (
        <section className="section section--contact" id="contact">
            <div>
                <p className="eyebrow">Contact</p>
                <h2>Have a project in mind?</h2>
                <p>
                    I&apos;m open to portfolio feedback, freelance opportunities, and collaborative frontend work.
                </p>
            </div>
            <Button href="mailto:hello@lunas.dev" variant="primary">
                Email me
            </Button>
        </section>
    );
}
