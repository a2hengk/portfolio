import { desc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import BackHeader from "@/components/Layout/BackHeader";
import Orb from "@/components/Layout/Orb";
import PageTitle from "@/components/Layout/PageTitle";
import SiteFooter from "@/components/Layout/SiteFooter";
import { db } from "@/db";
import { guestbookEntries } from "@/db/schema";
import { GUESTBOOK_ENTRIES_LIMIT } from "@/lib/guestbook-constants";
import { getLeaderboard, type LeaderboardEntry } from "@/lib/reaction-leaderboard";
import { alternatesFor, localizedHref } from "@/i18n/config";
import { getDictionary, hasLocale } from "../dictionaries";
import GuestbookForm from "./GuestbookForm";
import StartLights from "./StartLights";
import styles from "./pitwall.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/guestbook">): Promise<Metadata> {
    const { lang } = await params;
    if (!hasLocale(lang)) return {};
    const dict = await getDictionary(lang);

    return { ...dict.meta.guestbook, alternates: alternatesFor(lang, "/guestbook") };
}

export const dynamic = "force-dynamic";

async function loadLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
        return await getLeaderboard();
    } catch {
        // A leaderboard hiccup shouldn't take the guestbook down with it -
        // the game still runs, it just starts with an empty board.
        return [];
    }
}

export default async function GuestbookPage({ params }: PageProps<"/[lang]/guestbook">) {
    const { lang } = await params;
    if (!hasLocale(lang)) notFound();
    const dict = await getDictionary(lang);
    const t = dict.guestbook;

    const entries = await db
        .select()
        .from(guestbookEntries)
        .where(eq(guestbookEntries.status, "approved"))
        .orderBy(desc(guestbookEntries.createdAt))
        .limit(GUESTBOOK_ENTRIES_LIMIT);
    const leaderboard = await loadLeaderboard();

    return (
        <div className="page">
            <Orb color="dark" size="clamp(300px, 46vw, 680px)" opacity={0.9} left="-8%" top="-6%" />
            <Orb color="red" size="clamp(220px, 30vw, 440px)" opacity={0.4} right="4%" top="24%" duration={36} />
            <Orb color="light" size="clamp(220px, 32vw, 480px)" opacity={0.28} left="30%" bottom="-6%" duration={42} delay={-12} />

            <BackHeader lang={lang} label={dict.back}>
                <Link href={localizedHref(lang, "/links")}>{dict.nav.items.links}</Link>
            </BackHeader>

            <main id="top" className={`wrap ${styles.main}`}>
                <PageTitle kicker={t.intro.kicker} title={t.intro.title} text={t.intro.description} />

                <div className={styles.panels}>
                    <StartLights initialLeaderboard={leaderboard} dict={t.startLights} />
                    <section className={`glass ld ${styles.panel} ${styles.radio}`} aria-labelledby="pit-radio" style={{ animationDelay: "0.55s" }}>
                        <GuestbookForm lang={lang} dict={t.form} />
                    </section>
                </div>

                <section className={styles.log} aria-labelledby="pit-log">
                    <h2 id="pit-log" className="rv">
                        {t.log.title}
                    </h2>

                    {entries.length === 0 ? (
                        <p className={`mut ${styles.logEmpty}`}>{t.log.empty}</p>
                    ) : (
                        <ol className={styles.entries}>
                            {entries.map((entry) => (
                                <li key={entry.id} className={`rv ${styles.entry}`}>
                                    {entry.avatarUrl ? (
                                        <img src={entry.avatarUrl} alt="" className={styles.avatar} />
                                    ) : (
                                        <span className={styles.avatar} aria-hidden="true" />
                                    )}
                                    <div className={styles.entryBody}>
                                        <div className={styles.entryTop}>
                                            <strong>{entry.displayName}</strong>
                                            <span className="mut">{entry.authType === "discord" ? t.log.discord : t.log.guest}</span>
                                        </div>
                                        <p>{entry.message}</p>
                                        <time className="mut" dateTime={entry.createdAt.toISOString()}>
                                            {entry.createdAt.toLocaleDateString(t.log.dateLocale, {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </time>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    )}
                </section>
            </main>

            <SiteFooter lang={lang} dict={dict.footer} languages={dict.nav.language} path="/guestbook" />
        </div>
    );
}
