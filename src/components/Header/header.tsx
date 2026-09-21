"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import styles from "./header.module.css";

export default function Header() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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

    const navItems = [
        { href: "/about", label: "About" },
        { href: "/experience", label: "Experience" },
        { href: "/projects", label: "Projects" },
        { href: "/off-duty", label: "Off Duty" },
        { href: "/links", label: "Links" },
        { href: "/uses", label: "Uses" },
    ];

    return (
        <header className={styles.header}>
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
                        <small>Software Dev. / FIAE</small>
                    </span>
                </Link>

                <button
                    type="button"
                    className={styles.menuButton}
                    aria-expanded={isMenuOpen}
                    aria-controls="primary-navigation"
                    onClick={() => setIsMenuOpen((current) => !current)}
                >
                    <span>{isMenuOpen ? "Close" : "Menu"}</span>
                    <span aria-hidden="true" className={styles.menuButtonIcon} />
                </button>

                <nav
                    id="primary-navigation"
                    className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ""}`}
                    aria-label="Primary"
                >
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                aria-current={isActive ? "page" : undefined}
                                className={isActive ? styles.activeNavLink : undefined}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
}