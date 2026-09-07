import React from "react";
import Link from "next/link";
import styles from "./button.module.css";

export type ButtonVariant = "primary" | "secondary";

interface ButtonProps {
    href?: string;
    onClick?: () => void;
    children: React.ReactNode;
    variant?: ButtonVariant;
    className?: string;
}

// Links that leave the site (or open another app) get a plain <a>; anything
// pointing back into the app uses next/link for fast, client-side routing.
function isInternalHref(href: string) {
    return href.startsWith("/") || href.startsWith("#");
}

export default function Button({
    href,
    onClick,
    children,
    variant = "primary",
    className = "",
}: ButtonProps) {
    const buttonClasses = `${styles.button} ${styles[`button--${variant}`]} ${className}`;

    if (href) {
        if (isInternalHref(href)) {
            return (
                <Link href={href} className={buttonClasses}>
                    {children}
                </Link>
            );
        }

        const isHttpLink = href.startsWith("http");

        return (
            <a
                href={href}
                className={buttonClasses}
                {...(isHttpLink ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
                {children}
            </a>
        );
    }

    return (
        <button onClick={onClick} className={buttonClasses}>
            {children}
        </button>
    );
}
