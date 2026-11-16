import Link from "next/link";
import type { ReactNode } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import Orb from "@/components/Layout/Orb";
import { localizedHref, type Locale } from "@/i18n/config";
import styles from "./Contact.module.css";

// Last section of the one-pager; the footer sits inside it so the light
// carries through to the bottom edge.
export default function ContactSection({ lang, dict, footer }: { lang: Locale; dict: Dictionary["home"]["contact"]; footer: ReactNode }) {
    return (
        <section id="contact" className={`sec ${styles.contact}`}>
            <Orb color="dark" size="clamp(280px, 46vw, 680px)" opacity={0.9} right="4%" top="6%" duration={40} />
            <Orb color="red" size="clamp(200px, 28vw, 420px)" opacity={0.38} left="18%" top="30%" duration={32} delay={-10} />

            <div className={`wrap ${styles.inner}`}>
                <h2 className={`disp name rv ${styles.title}`} aria-label={dict.title}>
                    {dict.title.split(" ").map((word, index) => (
                        <span key={`${word}-${index}`} className={`ch ${styles.still}`} aria-hidden="true">
                            {word}
                        </span>
                    ))}
                </h2>
                <p className={`rv ${styles.text}`}>{dict.text}</p>
                <div className={`rv ${styles.actions}`}>
                    <Link className="btn btn-w" href={localizedHref(lang, "/links")}>
                        {dict.links}
                    </Link>
                    <a className="btn btn-g" href="https://github.com/a2hengk" target="_blank" rel="noopener noreferrer">
                        GitHub
                    </a>
                </div>
                {footer}
            </div>
        </section>
    );
}
