import Link from "next/link";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { fill, locales, localizedHref, type Locale } from "@/i18n/config";
import styles from "./SiteFooter.module.css";

type SiteFooterProps = {
    lang: Locale;
    dict: Dictionary["footer"];
    languages: Dictionary["nav"]["language"];
    /** Current page without locale ("/links"), so the language switch stays put. */
    path: string;
    /** Left-hand line; defaults to the Konami hint. */
    note?: string;
    /** Set when the footer sits inside a .wrap already (the one-pager's contact section). */
    inline?: boolean;
};

// Slim last line: a note, the language switch (which the nav hides on
// phones) and the Impressum link.
export default function SiteFooter({ lang, dict, languages, path, note, inline = false }: SiteFooterProps) {
    const other = locales.find((locale) => locale !== lang) ?? lang;

    return (
        <footer className={`${styles.footer} ${inline ? "" : "wrap"} mut`}>
            <div className={styles.line}>
                <span>{note ?? dict.hint}</span>
                <span className={styles.links}>
                    <Link
                        href={localizedHref(other, path)}
                        hrefLang={other}
                        lang={other}
                        aria-label={fill(languages.switchTo, { name: languages.names[other] })}
                    >
                        {other.toUpperCase()}
                    </Link>
                    <Link href={localizedHref(lang, "/legal")}>{dict.legal}</Link>
                </span>
            </div>
        </footer>
    );
}
