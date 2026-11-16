import type { ReactNode } from "react";
import styles from "./PageTitle.module.css";

type PageTitleProps = {
    /** Small line above, e.g. "Leave a message on the". */
    kicker?: string;
    /** The giant words; each word thaws in on its own. */
    title: string;
    text?: ReactNode;
    /** Smaller display size for long titles (legal, 404). */
    small?: boolean;
};

// Page heading for the standalone pages, same voice as the hero name.
export default function PageTitle({ kicker, title, text, small = false }: PageTitleProps) {
    const words = title.split(" ");

    return (
        <div className={styles.head}>
            {kicker ? <p className={`ld ${styles.kicker}`}>{kicker}</p> : null}
            <h1 className={`disp name ${small ? styles.small : ""}`} aria-label={title}>
                {words.map((word, index) => (
                    <span key={`${word}-${index}`} className="ch" aria-hidden="true" style={{ animationDelay: `${0.08 + index * 0.12}s` }}>
                        {word}
                    </span>
                ))}
            </h1>
            {text ? (
                <p className={`ld ${styles.text}`} style={{ animationDelay: `${0.2 + words.length * 0.1}s` }}>
                    {text}
                </p>
            ) : null}
        </div>
    );
}
