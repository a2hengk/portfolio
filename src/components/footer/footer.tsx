import Link from "next/link";

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="site-footer__content">
                <div className="site-footer__lead">
                    <p className="eyebrow">Contact</p>
                    <h3>Want to say hi or build something?</h3>
                    <p>
                        The quickest way to reach me is through the links page, or directly via GitHub and email.
                    </p>
                </div>

                <div className="site-footer__links" aria-label="Contact links">
                    <Link href="/links">Open links</Link>
                    <a href="https://github.com/a2hengk" target="_blank" rel="noopener noreferrer">
                        GitHub
                    </a>
                    <a href="mailto:heng.kevin05@gmail.com">Email</a>
                    <Link href="/legal">Impressum / Legal</Link>
                </div>
            </div>
            <p className="footer-hint">// sector 00 dev note: ↑ ↑ ↓ ↓ ← → ← → B A unlocks something</p>
        </footer>
    );
}