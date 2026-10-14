"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./header.module.css";

const navItems = [
    { href: "/", label: "Home", hint: "Start of the site" },
    { href: "/about", label: "About", hint: "Who I am" },
    { href: "/experience", label: "Experience", hint: "Apprenticeship and before" },
    { href: "/projects", label: "Projects", hint: "What I've built" },
    { href: "/off-duty", label: "Off Duty", hint: "Sim racing, games, anime" },
    { href: "/guestbook", label: "Pit Wall", hint: "Leave a message, set a reaction time" },
    { href: "/links", label: "Links", hint: "Where to find me" },
    { href: "/uses", label: "Uses", hint: "My setup" },
];

export default function Header() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const headerRef = useRef<HTMLElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
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

        const activeIndex = navItems.findIndex((item) => item.href === pathname);
        linkRefs.current[activeIndex >= 0 ? activeIndex : 0]?.focus();
    }, [isMenuOpen, pathname]);

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
        const focusables: HTMLElement[] = buttonRef.current ? [buttonRef.current, ...links] : [...links];
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
                <Link className={styles.brand} href="/" aria-label="Go to the top of the homepage" onClick={handleBrandClick}>
                    <Image
                        src="/profil.png"
                        alt="Profile picture"
                        width={56}
                        height={56}
                        priority
                        className={styles.avatar}
                    />
                    <span>
                        <strong>Lunas</strong>
                        <small>FIAE @ Herrenknecht</small>
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
                    <span>{isMenuOpen ? "Close" : "Menu"}</span>
                    <span aria-hidden="true" className={`${styles.menuButtonIcon} ${isMenuOpen ? styles.menuButtonIconOpen : ""}`} />
                </button>
            </div>

            <div className={`${styles.panel} ${isMenuOpen ? styles.panelOpen : ""}`} hidden={!isMenuOpen}>
                <span className={styles.panelStripe} aria-hidden="true" />
                <nav id="primary-navigation" className={styles.nav} aria-label="Primary">
                    {navItems.map((item, index) => {
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                ref={(element) => {
                                    linkRefs.current[index] = element;
                                }}
                                href={item.href}
                                aria-current={isActive ? "page" : undefined}
                                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                                onClick={() => closeMenu(false)}
                            >
                                <span className={styles.navLabel}>{item.label}</span>
                                <span className={styles.navHint}>{item.hint}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
}
