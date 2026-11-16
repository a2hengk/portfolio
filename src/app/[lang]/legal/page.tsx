import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BackHeader from "@/components/Layout/BackHeader";
import Orb from "@/components/Layout/Orb";
import PageTitle from "@/components/Layout/PageTitle";
import SiteFooter from "@/components/Layout/SiteFooter";
import { alternatesFor, fill, locales, localizedHref } from "@/i18n/config";
import { getDictionary, hasLocale } from "../dictionaries";
import styles from "./legal.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/legal">): Promise<Metadata> {
    const { lang } = await params;
    if (!hasLocale(lang)) return {};
    const dict = await getDictionary(lang);

    return { ...dict.meta.legal, alternates: alternatesFor(lang, "/legal") };
}

const EMAIL = "heng.kevin05@gmail.com";

export default async function LegalPage({ params }: PageProps<"/[lang]/legal">) {
    const { lang } = await params;
    if (!hasLocale(lang)) notFound();
    const dict = await getDictionary(lang);
    const t = dict.legal;
    const other = locales.find((locale) => locale !== lang) ?? lang;

    return (
        <div className="page">
            <Orb color="dark" size="clamp(300px, 46vw, 680px)" opacity={0.8} right="-8%" top="-8%" />
            <Orb color="light" size="clamp(220px, 30vw, 440px)" opacity={0.22} left="-6%" top="40%" duration={40} />

            <BackHeader lang={lang} label={dict.back}>
                <Link
                    href={localizedHref(other, "/legal")}
                    hrefLang={other}
                    lang={other}
                    aria-label={fill(dict.nav.language.switchTo, { name: dict.nav.language.names[other] })}
                >
                    {other.toUpperCase()}
                </Link>
            </BackHeader>

            <main id="top" className={`wrap ${styles.main}`}>
                <PageTitle title={t.title} text={t.description} small />

                <div className={`glass ld ${styles.panel}`} style={{ animationDelay: "0.5s" }}>
                    <section id="impressum">
                        <h2>{t.impressum.title}</h2>
                        <p>Kevin</p>
                        <p>
                            {t.impressum.contact} <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                        </p>
                    </section>

                    <section id="privacy">
                        <h2>{t.privacy.title}</h2>
                        <p>{t.privacy.intro}</p>
                        <p>
                            <strong>{t.privacy.messagesTitle}</strong> {t.privacy.messagesText}
                        </p>
                        <p>
                            <strong>{t.privacy.discordTitle}</strong> {t.privacy.discordBefore}{" "}
                            <a href="https://discord.com/privacy" target="_blank" rel="noopener noreferrer">
                                {t.privacy.discordLink}
                            </a>
                            {t.privacy.discordAfter.startsWith(".") ? "" : " "}
                            {t.privacy.discordAfter}
                        </p>
                        <p>
                            <strong>{t.privacy.spamTitle}</strong> {t.privacy.spamBefore}{" "}
                            <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">
                                {t.privacy.spamLink}
                            </a>
                            {t.privacy.spamAfter}
                        </p>
                        <p>{t.privacy.removal}</p>
                    </section>

                    <section id="rights">
                        <h2>{t.rights.title}</h2>
                        <p>{t.rights.text}</p>
                    </section>
                </div>
            </main>

            <SiteFooter lang={lang} dict={dict.footer} languages={dict.nav.language} path="/legal" />
        </div>
    );
}
