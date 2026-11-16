import Link from "next/link";
import type { ReactNode } from "react";
import { localizedHref, type Locale } from "@/i18n/config";
import styles from "./BackHeader.module.css";

// Top bar of the standalone pages: a glass pill back to the one-pager,
// plus one quiet link on the right.
export default function BackHeader({ lang, label, children }: { lang: Locale; label: string; children?: ReactNode }) {
    return (
        <header className={`wrap ${styles.header}`}>
            <Link className={styles.back} href={localizedHref(lang, "/")}>
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 7H2M6.5 2.5 2 7l4.5 4.5" />
                </svg>
                <span>{label}</span>
            </Link>
            {children ? <div className={styles.side}>{children}</div> : null}
        </header>
    );
}
