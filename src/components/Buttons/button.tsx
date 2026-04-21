import React from "react";
import styles from "./button.module.css";

export type ButtonVariant = "primary" | "secondary";

interface ButtonProps {
    href?: string;
    onClick?: () => void;
    children: React.ReactNode;
    variant?: ButtonVariant;
    className?: string;
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
        return (
            <a href={href} className={buttonClasses}>
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
