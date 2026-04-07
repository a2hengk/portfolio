"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./header.module.css";

export default function Header() {
    return (
        <header>
            <div className={styles.headerContent}>
                <Image
                    src="/profil.png"
                    alt="Profile Picture"
                    width={100}
                    height={100}
                />
                <nav className={styles.nav}>
                    <ul className={styles.navList}>
                        <li className={styles.navList}><Link href="/">Home</Link>
                        </li>
                        <li className={styles.navList}><Link href="/about">About</Link>
                        </li>
                        <li className={styles.navList}><Link href="/projects">Projects</Link>
                        </li>
                        <li className={styles.navList}><Link href="/contact">Contact</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );          
}