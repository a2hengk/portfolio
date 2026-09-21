import { desc, eq } from "drizzle-orm";
import PageIntro from "@/components/PageIntro";
import { db } from "@/db";
import { guestbookEntries } from "@/db/schema";
import { GUESTBOOK_ENTRIES_LIMIT } from "@/lib/guestbook-constants";
import GuestbookForm from "./GuestbookForm";

export const metadata = {
    title: "Pit Wall - Lunas",
    description: "Leave a message - anonymous or signed in with Discord.",
};

export const dynamic = "force-dynamic";

export default async function GuestbookPage() {
    const entries = await db
        .select()
        .from(guestbookEntries)
        .where(eq(guestbookEntries.status, "approved"))
        .orderBy(desc(guestbookEntries.createdAt))
        .limit(GUESTBOOK_ENTRIES_LIMIT);

    return (
        <main id="top" className="route-page">
            <PageIntro
                sector="07"
                eyebrow="Pit Wall"
                title="Leave a message on the pit wall."
                description="Anonymous or signed in with Discord - anonymous notes get a quick look before they show up here."
            />

            <section className="route-section">
                <div className="section__heading">
                    <div className="section-marker">
                        <span className="sector-tag">Radio check</span>
                        <p className="eyebrow">Say something</p>
                    </div>
                    <h2>How does the site look from where you&apos;re sitting?</h2>
                </div>
                <GuestbookForm />
            </section>

            <section className="route-section">
                <div className="section__heading">
                    <div className="section-marker">
                        <span className="sector-tag">Log</span>
                        <p className="eyebrow">Messages</p>
                    </div>
                    <h2>What&apos;s come through so far.</h2>
                </div>

                {entries.length === 0 ? (
                    <p className="guestbook-empty">No messages yet - be the first one on the radio.</p>
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
                                            {entry.authType === "discord" ? "Discord" : "Guest"}
                                        </span>
                                    </div>
                                    <p className="guestbook-entry__message">{entry.message}</p>
                                    <time className="guestbook-entry__date" dateTime={entry.createdAt.toISOString()}>
                                        {entry.createdAt.toLocaleDateString("en-GB", {
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
