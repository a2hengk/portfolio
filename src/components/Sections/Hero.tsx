import Link from "next/link";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import Orb from "@/components/Layout/Orb";
import { LAP_PROFILE_AREA, LAP_PROFILE_POINTS, LAP_PROFILE_VIEWBOX } from "@/data/nordschleife";
import { localizedHref, type Locale } from "@/i18n/config";
import styles from "./Hero.module.css";

const NAME = "Lunas";

export default function HeroSection({ lang, dict }: { lang: Locale; dict: Dictionary["home"]["hero"] }) {
    const tele = [
        { key: dict.tele.stack, value: "Next.js, TS, React" },
        { key: dict.tele.base, value: "Herrenknecht AG" },
        { key: dict.tele.training, value: dict.tele.trainingValue },
    ];

    return (
        <section className={`sec ${styles.hero}`}>
            <Orb color="dark" size="clamp(300px, 48vw, 700px)" opacity={0.9} right="-8%" top="-6%" />
            <Orb color="light" size="clamp(220px, 30vw, 440px)" opacity={0.4} right="22%" top="34%" duration={36} />
            <Orb color="red" size="clamp(200px, 26vw, 380px)" opacity={0.42} left="-6%" bottom="-4%" duration={42} delay={-12} />

            <div className={`wrap ${styles.inner}`}>
                <p className={`ld ${styles.kicker}`}>{dict.kicker}</p>
                <h1 className={`disp ${styles.name}`} aria-label={NAME}>
                    {NAME.split("").map((letter, index) => (
                        <span key={index} className="ch" aria-hidden="true" style={{ animationDelay: `${0.05 + index * 0.08}s` }}>
                            {letter}
                        </span>
                    ))}
                </h1>

                <figure className={`ld ${styles.trace}`} style={{ animationDelay: "0.5s" }}>
                    <svg viewBox={LAP_PROFILE_VIEWBOX} preserveAspectRatio="none" role="img" aria-label={dict.traceAria}>
                        <polygon className={styles.traceArea} points={LAP_PROFILE_AREA} />
                        <polyline className={styles.traceLine} points={LAP_PROFILE_POINTS} />
                    </svg>
                    <figcaption className="mut">{dict.traceCaption}</figcaption>
                </figure>

                <div className={`ld ${styles.intro}`} style={{ animationDelay: "0.6s" }}>
                    <p className={styles.lede}>{dict.lede}</p>
                    <div className={styles.actions}>
                        <Link className="btn btn-w" href={localizedHref(lang, "/#builds")}>
                            {dict.primaryAction}
                        </Link>
                        <Link className="btn btn-g" href={localizedHref(lang, "/#path")}>
                            {dict.secondaryAction}
                        </Link>
                    </div>
                </div>

                <dl className={`glass ld ${styles.tele}`} aria-label={dict.teleAria} style={{ animationDelay: "0.85s" }}>
                    {tele.map((cell) => (
                        <div key={cell.key} className={styles.cell}>
                            <dt>{cell.key}</dt>
                            <dd>{cell.value}</dd>
                        </div>
                    ))}
                    <div className={styles.cell}>
                        <dt>{dict.tele.status}</dt>
                        <dd>
                            <span className="dot live" aria-hidden="true" />
                            <span>{dict.tele.statusValue}</span>
                        </dd>
                    </div>
                </dl>
            </div>
        </section>
    );
}
