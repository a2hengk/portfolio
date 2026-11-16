import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import BackHeader from "@/components/Layout/BackHeader";
import { ArrowUpRight } from "@/components/Layout/Icons";
import Orb from "@/components/Layout/Orb";
import PageTitle from "@/components/Layout/PageTitle";
import SiteFooter from "@/components/Layout/SiteFooter";
import { alternatesFor, fill, locales, localizedHref } from "@/i18n/config";
import { getDictionary, hasLocale } from "../dictionaries";
import CopyHandle from "./CopyHandle";
import styles from "./links.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/links">): Promise<Metadata> {
    const { lang } = await params;
    if (!hasLocale(lang)) return {};
    const dict = await getDictionary(lang);

    return { ...dict.meta.links, alternates: alternatesFor(lang, "/links") };
}

type RowId = "github" | "discord" | "instagram" | "tiktok" | "email";

const EMAIL = "heng.kevin05@gmail.com";
const DISCORD_HANDLE = "lunas3407";

const ROWS: { id: RowId; name: string; href: string | null }[] = [
    { id: "github", name: "GitHub", href: "https://github.com/a2hengk" },
    { id: "discord", name: "Discord", href: null },
    { id: "instagram", name: "Instagram", href: "https://www.instagram.com/hengkevin1405?igsh=MWF2aWZmb2tqdXhuNw==" },
    { id: "tiktok", name: "TikTok", href: "https://www.tiktok.com/@lunas.118f20?_r=1&_t=ZG-95j9qvTOsWO" },
    { id: "email", name: "", href: `mailto:${EMAIL}` },
];

// Generic line icons rather than brand logos, same recipe as everywhere else.
function RowIcon({ id }: { id: RowId }) {
    return (
        <span className={styles.ico} aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {id === "github" ? (
                    <>
                        <polyline points="8 6 3 12 8 18" />
                        <polyline points="16 6 21 12 16 18" />
                    </>
                ) : null}
                {id === "discord" ? (
                    <>
                        <rect x="3" y="6" width="18" height="12" rx="5" />
                        <circle cx="9" cy="12" r="0.6" fill="currentColor" stroke="none" />
                        <circle cx="15" cy="12" r="0.6" fill="currentColor" stroke="none" />
                    </>
                ) : null}
                {id === "instagram" ? (
                    <>
                        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                        <circle cx="12" cy="12" r="4" />
                        <circle cx="17" cy="7" r="0.6" fill="currentColor" stroke="none" />
                    </>
                ) : null}
                {id === "tiktok" ? (
                    <>
                        <path d="M12 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
                        <path d="M12 3c.5 2.8 2.6 4.8 5 5" />
                    </>
                ) : null}
                {id === "email" ? (
                    <>
                        <rect x="3" y="5.5" width="18" height="13" rx="3" />
                        <polyline points="4 8 12 13.5 20 8" />
                    </>
                ) : null}
            </svg>
        </span>
    );
}

export default async function LinksPage({ params }: PageProps<"/[lang]/links">) {
    const { lang } = await params;
    if (!hasLocale(lang)) notFound();
    const dict = await getDictionary(lang);
    const t = dict.links;
    const other = locales.find((locale) => locale !== lang) ?? lang;

    return (
        <div className="page">
            <Orb color="dark" size="clamp(300px, 46vw, 680px)" opacity={0.9} right="-6%" top="-10%" />
            <Orb color="light" size="clamp(220px, 30vw, 440px)" opacity={0.36} right="26%" top="38%" duration={36} />
            <Orb color="red" size="clamp(200px, 26vw, 380px)" opacity={0.42} left="-6%" bottom="-8%" duration={42} delay={-12} />

            <BackHeader lang={lang} label={dict.back}>
                <Link
                    href={localizedHref(other, "/links")}
                    hrefLang={other}
                    lang={other}
                    aria-label={fill(dict.nav.language.switchTo, { name: dict.nav.language.names[other] })}
                >
                    {other.toUpperCase()}
                </Link>
            </BackHeader>

            <main id="top" className={`wrap ${styles.main}`}>
                <div className={styles.intro}>
                    <div className={`ld ${styles.who}`}>
                        <Image src="/profil.png" alt={t.avatarAlt} width={72} height={72} priority className={styles.avatar} />
                        <div>
                            <strong>Lunas</strong>
                            <span className="mut">{t.role}</span>
                        </div>
                    </div>
                    <div className={styles.title}>
                        <PageTitle kicker={t.kicker} title={t.title} text={t.text} />
                    </div>
                </div>

                <ul className={styles.list} aria-label={t.listAria}>
                    {ROWS.map((row, index) => {
                        const name = row.id === "email" ? t.rows.email : row.name;
                        const sub = row.id === "email" ? EMAIL : t.rows[row.id];
                        const body = (
                            <>
                                <RowIcon id={row.id} />
                                <span className={styles.label}>
                                    <span className={styles.name}>
                                        <span>{name}</span>
                                        {row.id === "discord" ? <span className="dot live" aria-hidden="true" /> : null}
                                    </span>
                                    <span className={`mut ${styles.sub}`}>{sub}</span>
                                </span>
                            </>
                        );
                        const delay = { animationDelay: `${0.3 + index * 0.08}s` };

                        return (
                            <li key={row.id}>
                                {row.href ? (
                                    <a
                                        className={`glass card ld ${styles.row}`}
                                        style={delay}
                                        href={row.href}
                                        {...(row.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                                    >
                                        {body}
                                        <ArrowUpRight size={16} className={styles.arrow} />
                                    </a>
                                ) : (
                                    <div className={`glass card ld ${styles.row}`} style={delay}>
                                        {body}
                                        <CopyHandle handle={DISCORD_HANDLE} dict={t.copy} />
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </main>

            <SiteFooter lang={lang} dict={dict.footer} languages={dict.nav.language} path="/links" note={t.note} />
        </div>
    );
}
