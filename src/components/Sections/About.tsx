import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { ArrowDown } from "@/components/Layout/Icons";
import { localizedHref, type Locale } from "@/i18n/config";
import styles from "./About.module.css";

export default function AboutSection({ lang, dict }: { lang: Locale; dict: Dictionary["home"]["about"] }) {
    return (
        <section id="about" className="sec">
            <div className={`wrap ${styles.inner}`}>
                <h2 className="disp h2 rv">{dict.title}</h2>
                <div className={styles.body}>
                    <Image
                        className={`rv ${styles.avatar}`}
                        src="/profil.png"
                        alt={dict.avatarAlt}
                        width={168}
                        height={168}
                        sizes="(max-width: 900px) 112px, 168px"
                    />
                    <p className={`rv ${styles.text}`}>{dict.text}</p>
                    <div className={`glass rv ${styles.off}`}>
                        <h3>{dict.offTitle}</h3>
                        <p className="mut">{dict.offText}</p>
                        <Link className="ext" href={localizedHref(lang, "/#offduty")}>
                            <span>{dict.offAction}</span>
                            <ArrowDown />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
