import Link from "next/link";

export default function LegalPage() {
    return (
        <main className="container legal-page">
            <header className="section__heading">
                <p className="eyebrow">Legal</p>
                <h1>Impressum & Legal information</h1>
            </header>

            <section className="legal-section" id="impressum">
                <h2>Impressum</h2>
                <p>
                    Site owner: <strong>Psydos Name</strong>
                </p>
                <p>
                    Contact: <a href="mailto:contact@psydos.example">contact@psydos.example</a>
                </p>
                <p>
                    Address: Example Street 1, 12345 Example City, Country
                </p>
                <p>
                    Phone: +49 123 456789 (placeholder)
                </p>
                <p>
                    Company / VAT ID: DE000000000 (placeholder)
                </p>
                <p>
                    These are placeholder details (psydos). Replace them with your real contact and
                    registration information when ready.
                </p>
            </section>

            <section className="legal-section" id="privacy">
                <h2>Privacy & Data Protection</h2>
                <p>
                    This site may collect minimal analytics and contact form data. If you prefer to
                    host a full privacy policy elsewhere, replace this section with a link or the
                    complete policy text. For now, this is a placeholder note.
                </p>
            </section>

            <section className="legal-section" id="rights">
                <h2>Copyright & Legal Rights</h2>
                <p>
                    All content on this site is © the site owner unless otherwise stated. If you
                    believe material on this site infringes your copyright, please contact the site
                    owner using the details above so the issue can be resolved.
                </p>
            </section>

            <footer className="legal-footer">
                <Link href="/">Back to home</Link>
            </footer>
        </main>
    );
}
