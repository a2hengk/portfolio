"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, type MouseEvent } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { fill, locales, localizedHref, type Locale } from "@/i18n/config";
import styles from "./Nav.module.css";

// Section anchors on the one-pager plus the two pages that live on their
// own. `opt` items drop out under 560px.
const ITEMS = [
    { key: "about", href: "/#about", opt: true },
    { key: "builds", href: "/#builds", opt: false },
    { key: "path", href: "/#path", opt: false },
    { key: "setup", href: "/#stack", opt: true },
    { key: "offDuty", href: "/#offduty", opt: true },
    { key: "pitWall", href: "/guestbook", opt: false },
    { key: "links", href: "/links", opt: false },
] as const;

export default function Nav({ lang, dict }: { lang: Locale; dict: Dictionary["nav"] }) {
    // Easter egg: 5 clicks on the brand within ~1.6s fires launch control
    // instead of jumping to the top.
    const clickTimes = useRef<number[]>([]);

    const handleBrandClick = (event: MouseEvent) => {
        const now = Date.now();
        clickTimes.current = [...clickTimes.current, now].filter((time) => now - time < 1600);

        if (clickTimes.current.length >= 5) {
            event.preventDefault();
            clickTimes.current = [];
            window.dispatchEvent(new Event("bmw-launch"));
        }
    };

    const other = locales.find((locale) => locale !== lang) ?? lang;

    return (
        <header className={styles.nav}>
            <div className={styles.progress} aria-hidden="true" />
            <nav className={styles.inner} aria-label={dict.aria}>
                <Link
                    href={localizedHref(lang, "/#top")}
                    className={styles.brand}
                    aria-label={dict.brandAria}
                    onClick={handleBrandClick}
                >
                    <Image src="/profil.png" alt="" width={32} height={32} priority className={styles.avatar} />
                    <span>Lunas</span>
                </Link>

                {ITEMS.map((item) => (
                    <Link
                        key={item.key}
                        href={localizedHref(lang, item.href)}
                        className={item.opt ? styles.opt : undefined}
                    >
                        {dict.items[item.key]}
                    </Link>
                ))}

                <Link
                    href={localizedHref(other, "/")}
                    hrefLang={other}
                    lang={other}
                    aria-label={fill(dict.language.switchTo, { name: dict.language.names[other] })}
                    className={`${styles.opt} ${styles.lang}`}
                >
                    {other.toUpperCase()}
                </Link>
            </nav>
        </header>
    );
}
