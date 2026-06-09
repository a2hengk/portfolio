"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./header.module.css";

export default function Header() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { href: "/about", label: "About" },
        { href: "/experience", label: "Experience" },
        { href: "/projects", label: "Projects" },
        { href: "/links", label: "Links" },
        { href: "/uses", label: "Uses" },
    ];

    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                <Link className={styles.brand} href="/#top" aria-label="Go to the top of the homepage">
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
                        <small>Software Dev. / Student</small>
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