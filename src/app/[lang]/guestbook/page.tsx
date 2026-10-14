import { desc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import { db } from "@/db";
import { guestbookEntries } from "@/db/schema";
import { GUESTBOOK_ENTRIES_LIMIT } from "@/lib/guestbook-constants";
import StartLights from "@/components/Sections/StartLights";
import { getLeaderboard, type LeaderboardEntry } from "@/lib/reaction-leaderboard";
import { alternatesFor } from "@/i18n/config";
import { getDictionary, hasLocale } from "../dictionaries";
import GuestbookForm from "./GuestbookForm";

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
        <main id="top" className="route-page">
            <PageIntro
                sector="07"
                eyebrow={t.intro.eyebrow}
                title={t.intro.title}
                description={t.intro.description}
            />

            <section className="route-section">
                <div className="section__heading">
                    <div className="section-marker">
                        <span className="sector-tag">{t.form.tag}</span>
                        <p className="eyebrow">{t.form.eyebrow}</p>
                    </div>
                    <h2>{t.form.title}</h2>
                </div>
                <GuestbookForm lang={lang} dict={t.form} />
            </section>

            <StartLights initialLeaderboard={leaderboard} dict={t.startLights} />

            <section className="route-section">
                <div className="section__heading">
                    <div className="section-marker">
                        <span className="sector-tag">{t.log.tag}</span>
                        <p className="eyebrow">{t.log.eyebrow}</p>
                    </div>
                    <h2>{t.log.title}</h2>
                </div>

                {entries.length === 0 ? (
                    <p className="guestbook-empty">{t.log.empty}</p>
                ) : (
                    <div className="guestbook-entries">
                        {entries.map((entry) => (
                            <article key={entry.id} className="guestbook-entry">
                                {entry.avatarUrl ? (
                                    <img src={entry.avatarUrl} alt="" className="guestbook-entry__avatar" />
                                ) : (
                                    <span className="guestbook-entry__avatar guestbook-entry__avatar--placeholder" aria-hidden="true" />
                                )}
                                <div className="guestbook-entry__body">
                                    <div className="guestbook-entry__top">
                                        <strong>{entry.displayName}</strong>
                                        <span className="guestbook-entry__source">
                                            {entry.authType === "discord" ? t.log.discord : t.log.guest}
                                        </span>
                                    </div>
                                    <p className="guestbook-entry__message">{entry.message}</p>
                                    <time className="guestbook-entry__date" dateTime={entry.createdAt.toISOString()}>
                                        {entry.createdAt.toLocaleDateString(t.log.dateLocale, {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </time>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
