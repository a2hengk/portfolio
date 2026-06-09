import Button from "@/components/Buttons/button";

export default function ContactSection() {
    return (
        <section className="section section--contact" id="contact">
            <div>
                <p className="eyebrow">Contact</p>
                <h2>Have a project in mind or just want to say hi?</h2>
                <p>
                    The links page has the fastest ways to reach me, and the footer keeps the contact paths close on every page.
                </p>
            </div>
            <Button href="/links" variant="primary">
                View contact links
            </Button>
        </section>
    );
}
