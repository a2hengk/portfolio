import Link from "next/link";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { localizedHref, type Locale } from "@/i18n/config";

export default function Footer({ lang, dict }: { lang: Locale; dict: Dictionary["footer"] }) {
    return (
        <footer className="site-footer">
            <div className="site-footer__content">
                <div className="site-footer__lead">
                    <p className="eyebrow">{dict.eyebrow}</p>
                    <h3>{dict.title}</h3>
                    <p>
                        {dict.text}
                    </p>
                </div>

                <div className="site-footer__links" aria-label={dict.linksAria}>
                    <Link href={localizedHref(lang, "/links")}>{dict.openLinks}</Link>
                    <a href="https://github.com/a2hengk" target="_blank" rel="noopener noreferrer">
                        GitHub
                    </a>
                    <a href="mailto:heng.kevin05@gmail.com">{dict.email}</a>
                    <Link href={localizedHref(lang, "/legal")}>{dict.legal}</Link>
                </div>
            </div>
            <p className="footer-hint">{dict.hint}</p>
        </footer>
    );
}
