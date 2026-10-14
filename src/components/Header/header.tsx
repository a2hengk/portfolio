"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { locales, localizedHref, stripLocale, type Locale } from "@/i18n/config";
import styles from "./header.module.css";

// Labels and hints come from the dictionary, keyed by `key`.
const navItems = [
    { href: "/", key: "home" },
    { href: "/about", key: "about" },
    { href: "/experience", key: "experience" },
    { href: "/projects", key: "projects" },
    { href: "/off-duty", key: "offDuty" },
    { href: "/guestbook", key: "guestbook" },
    { href: "/links", key: "links" },
    { href: "/uses", key: "uses" },
] as const;

export default function Header({ lang, dict }: { lang: Locale; dict: Dictionary["header"] }) {
    const pathname = usePathname();
    // Path without the /en or /de prefix - used for the active link and
    // so the language switch stays on the same page (/en/about <-> /de/about).
    const basePath = stripLocale(pathname);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const headerRef = useRef<HTMLElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    const langRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    // Easter egg: 5 clicks on the brand within ~1.6s fires launch control
    // instead of navigating home. Header lives outside <main> in the root
    // layout, so it never remounts between routes and this ref survives
    // client-side navigation.
    const clickTimes = useRef<number[]>([]);

    const handleBrandClick = (event: React.MouseEvent) => {
        const now = Date.now();
        clickTimes.current = [...clickTimes.current, now].filter((time) => now - time < 1600);

        if (clickTimes.current.length >= 5) {
            event.preventDefault();
            clickTimes.current = [];
            window.dispatchEvent(new Event("bmw-launch"));
        }
    };

    const closeMenu = useCallback((returnFocus: boolean) => {
        setIsMenuOpen(false);
        if (returnFocus) {
            buttonRef.current?.focus();
        }
    }, []);

    // Close whenever the route changes (covers back/forward too, not just
    // clicks on a menu link).
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    // On open, put focus on the current page's link (or the first one) so
    // keyboard users land inside the menu.
    useEffect(() => {
        if (!isMenuOpen) {
            return;
        }

        const activeIndex = navItems.findIndex((item) => item.href === basePath);
        linkRefs.current[activeIndex >= 0 ? activeIndex : 0]?.focus();
    }, [isMenuOpen, basePath]);

    // Click or tap outside the header closes the menu.
    useEffect(() => {
        if (!isMenuOpen) {
            return;
        }

        const handlePointerDown = (event: PointerEvent) => {
            if (!headerRef.current?.contains(event.target as Node)) {
                closeMenu(false);
            }
        };

        document.addEventListener("pointerdown", handlePointerDown);
        return () => document.removeEventListener("pointerdown", handlePointerDown);
    }, [isMenuOpen, closeMenu]);

    // Keyboard handling while open: Esc closes, Tab cycles between the
    // toggle and the links (focus stays in the menu), arrows/Home/End move
    // between links.
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (!isMenuOpen) {
            return;
        }

        if (event.key === "Escape") {
            event.preventDefault();
            closeMenu(true);
            return;
        }

        const links = linkRefs.current.filter((link): link is HTMLAnchorElement => link !== null);
        const langLinks = langRefs.current.filter((link): link is HTMLAnchorElement => link !== null);
        // The language links sit after the nav, so Tab still cycles through
        // everything inside the open menu.
        const focusables: HTMLElement[] = buttonRef.current
            ? [buttonRef.current, ...links, ...langLinks]
            : [...links, ...langLinks];
        const currentIndex = focusables.indexOf(document.activeElement as HTMLElement);

        if (event.key === "Tab") {
            event.preventDefault();
            const step = event.shiftKey ? -1 : 1;
            const next = (currentIndex + step + focusables.length) % focusables.length;
            focusables[next].focus();
            return;
        }

        const linkIndex = links.indexOf(document.activeElement as HTMLAnchorElement);
        let target: number | null = null;

        if (event.key === "ArrowDown" || event.key === "ArrowRight") {
            target = linkIndex < 0 ? 0 : (linkIndex + 1) % links.length;
        } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
            target = linkIndex < 0 ? links.length - 1 : (linkIndex - 1 + links.length) % links.length;
        } else if (event.key === "Home") {
            target = 0;
        } else if (event.key === "End") {
            target = links.length - 1;
        }

        if (target !== null) {
            event.preventDefault();
            links[target]?.focus();
        }
    };

    return (
        <header ref={headerRef} className={styles.header} onKeyDown={handleKeyDown}>
            <div className={styles.inner}>
                <Link className={styles.brand} href={localizedHref(lang, "/")} aria-label={dict.brandAria} onClick={handleBrandClick}>
                    <Image
                        src="/profil.png"
                        alt={dict.avatarAlt}
                        width={56}
                        height={56}
                        priority
                        className={styles.avatar}
                    />
                    <span>
                        <strong>Lunas</strong>
                        <small>{dict.role}</small>
                    </span>
                </Link>

                <button
                    ref={buttonRef}
                    type="button"
                    className={styles.menuButton}
                    aria-expanded={isMenuOpen}
                    aria-controls="primary-navigation"
                    onClick={() => setIsMenuOpen((current) => !current)}
                >
                    <span>{isMenuOpen ? dict.close : dict.menu}</span>
                    <span aria-hidden="true" className={`${styles.menuButtonIcon} ${isMenuOpen ? styles.menuButtonIconOpen : ""}`} />
                </button>
            </div>

            <div className={`${styles.panel} ${isMenuOpen ? styles.panelOpen : ""}`} hidden={!isMenuOpen}>
                <span className={styles.panelStripe} aria-hidden="true" />
                <nav id="primary-navigation" className={styles.nav} aria-label={dict.navAria}>
                    {navItems.map((item, index) => {
                        const isActive = basePath === item.href;
                        const copy = dict.nav[item.key];

                        return (
                            <Link
                                key={item.href}
                                ref={(element) => {
                                    linkRefs.current[index] = element;
                                }}
                                href={localizedHref(lang, item.href)}
                                aria-current={isActive ? "page" : undefined}
                                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                                onClick={() => closeMenu(false)}
                            >
                                <span className={styles.navLabel}>{copy.label}</span>
                                <span className={styles.navHint}>{copy.hint}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className={styles.language} role="group" aria-label={dict.language.aria}>
                    <span className={styles.languageLabel}>{dict.language.label}</span>
                    {locales.map((locale, index) => {
                        const isCurrent = locale === lang;

                        return (
                            <Link
                                key={locale}
                                ref={(element) => {
                                    langRefs.current[index] = element;
                                }}
                                href={localizedHref(locale, basePath)}
                                hrefLang={locale}
                                lang={locale}
                                aria-current={isCurrent ? "true" : undefined}
                                aria-label={dict.language.names[locale]}
                                className={`${styles.languageLink} ${isCurrent ? styles.languageLinkActive : ""}`}
                                onClick={() => closeMenu(false)}
                            >
                                {locale.toUpperCase()}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </header>
    );
}
