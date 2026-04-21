import Link from "next/link";
import Image from "next/image";
import styles from "./header.module.css";

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                <Link className={styles.brand} href="/#top" aria-label="Go to the top of the homepage">
                    <Image
                        src="/profil.png"
                        alt="Profile picture"
                        width={56}
                        height={56}
                        className={styles.avatar}
                    />
                    <span>
                        <strong>Lunas</strong>
                        <small>Creative developer</small>
                    </span>
                </Link>

                <nav className={styles.nav} aria-label="Primary">
                    <Link href="/#stack">Stack</Link>
                    <Link href="/#projects">Projects</Link>
                    <Link href="/#games">Games</Link>
                    <Link href="/links">Links</Link>
                    <Link href="/uses">Uses</Link>
                    <Link href="/#contact">Contact</Link>
                </nav>
            </div>
        </header>
    );
}