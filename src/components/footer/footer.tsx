import Link from "next/link";

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="site-footer__content">
                <div className="site-footer__lead">
                    <p className="eyebrow">Contact</p>
                    <h2>Want to say hi or build something?</h2>
                    <p>
                        The quickest way to reach me is through the links page, or directly via GitHub and Discord.
                    </p>
                </div>

                <div className="site-footer__links" aria-label="Contact links">
                    <Link href="/links">Open links</Link>
                    <a href="https://github.com/a2hengk" target="_blank" rel="noopener noreferrer">
                        GitHub
                    </a>
                    <a href="https://discord.com/" target="_blank" rel="noopener noreferrer">
                        Discord
                    </a>
                    <Link href="/legal">Impressum / Legal</Link>
                </div>
            </div>
        </footer>
    );
}