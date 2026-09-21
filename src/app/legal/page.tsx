import Button from "@/components/Buttons/button";
import PageIntro from "@/components/PageIntro";

export const metadata = {
    title: "Legal - Lunas",
    description: "Impressum and legal information.",
};

export default function LegalPage() {
    return (
        <main id="top" className="route-page">
            <PageIntro
                eyebrow="Legal"
                title="Impressum & legal information."
                description="This is a private, non-commercial portfolio project."
            />

            <section className="route-section" id="impressum">
                <div className="section__heading">
                    <p className="eyebrow">Impressum</p>
                    <h2>Site owner</h2>
                </div>
                <p>Kevin</p>
                <p>
                    Contact: <a href="mailto:heng.kevin05@gmail.com">heng.kevin05@gmail.com</a>
                </p>
            </section>

            <section className="route-section" id="privacy">
                <div className="section__heading">
                    <p className="eyebrow">Privacy</p>
                    <h2>Data protection</h2>
                </div>
                <p>
                    This site does not use analytics, tracking, or cookies, and it does not collect
                    any personal data from visitors. If that changes, this section will be updated.
                </p>
            </section>

            <section className="route-section" id="rights">
                <div className="section__heading">
                    <p className="eyebrow">Copyright</p>
                    <h2>Rights</h2>
                </div>
                <p>
                    All content on this site is © the site owner unless otherwise stated. If you
                    believe material on this site infringes your copyright, please get in touch
                    using the contact details above so the issue can be resolved.
                </p>
            </section>

            <div className="route-inline-actions">
                <Button href="/" variant="secondary">
                    Back to home
                </Button>
            </div>
        </main>
    );
}
