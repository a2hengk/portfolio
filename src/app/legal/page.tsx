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
                    Most of this site does not use analytics, tracking, or cookies, and does not collect
                    any personal data. The Pit Wall guestbook is the exception - here is what it collects
                    and why:
                </p>
                <p>
                    <strong>Guestbook messages.</strong> Anything you post to the Pit Wall (your display
                    name and message, plus your Discord name and avatar if you sign in) is stored and
                    shown publicly on that page.
                </p>
                <p>
                    <strong>Discord sign-in.</strong> Signing in with Discord is handled by Discord&apos;s
                    own OAuth login - this site receives your Discord user ID, display name, and avatar
                    URL, which are stored so your entry can show up as a Discord post. See{" "}
                    <a href="https://discord.com/privacy" target="_blank" rel="noopener noreferrer">
                        Discord&apos;s privacy policy
                    </a>{" "}
                    for how Discord itself handles your data.
                </p>
                <p>
                    <strong>Spam protection.</strong> Submitting to the Pit Wall runs a Cloudflare
                    Turnstile check, which processes some technical signals about your browser/request to
                    tell humans from bots - see{" "}
                    <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">
                        Cloudflare&apos;s privacy policy
                    </a>
                    . A salted, one-way hash of your IP address is also stored for up to 24 hours to
                    rate-limit repeated submissions; the hash cannot be reversed back into an IP address,
                    and it is not linked to your message.
                </p>
                <p>
                    Want a guestbook entry removed? Get in touch using the contact details above.
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
