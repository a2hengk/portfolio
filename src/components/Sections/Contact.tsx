import Button from "@/components/Buttons/button";

export default function ContactSection() {
    return (
        <section className="section section--contact" id="contact">
            <div>
                <p className="eyebrow">Contact</p>
                <h2>Have a project in mind?</h2>
                <p>
                    My full contact list lives on the links page, so you can reach me through the channel that fits best.
                </p>
            </div>
            <Button href="/links" variant="primary">
                View my links
            </Button>
        </section>
    );
}
