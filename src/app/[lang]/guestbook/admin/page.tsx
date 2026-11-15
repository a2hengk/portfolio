import { desc } from "drizzle-orm";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import BackHeader from "@/components/Layout/BackHeader";
import Orb from "@/components/Layout/Orb";
import PageTitle from "@/components/Layout/PageTitle";
import { getDictionary, hasLocale } from "../../dictionaries";
import type { Locale } from "@/i18n/config";
import { db } from "@/db";
import { guestbookEntries } from "@/db/schema";
import { getAdminAccess } from "@/lib/admin";
import { approveEntry, deleteEntry } from "../actions";
import { deleteReactionScore } from "../reaction-actions";
import { getLeaderboard } from "@/lib/reaction-leaderboard";
import AdminSignInButton from "./SignInButton";
import SignOutButton from "./SignOutButton";
import styles from "./admin.module.css";

export const metadata = {
    title: "Pit Wall Admin - Lunas",
    robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

// Admin copy stays English-only, only the back link follows the locale.
async function Shell({ lang, title, description, children }: { lang: Locale; title: string; description: string; children: ReactNode }) {
    const dict = await getDictionary(lang);

    return (
        <div className="page">
            <Orb color="dark" size="clamp(300px, 46vw, 680px)" opacity={0.8} right="-8%" top="-8%" />
            <BackHeader lang={lang} label={dict.back} />
            <main id="top" className={`wrap ${styles.main}`}>
                <PageTitle kicker="Pit Wall" title={title} text={description} small />
                {children}
            </main>
        </div>
    );
}

function Section({ label, title, children }: { label: string; title: string; children: ReactNode }) {
    return (
        <section className={styles.section}>
            <p className="mut">{label}</p>
            <h2 className="disp">{title}</h2>
            {children}
        </section>
    );
}

export default async function GuestbookAdminPage({ params }: PageProps<"/[lang]/guestbook/admin">) {
    const { lang } = await params;
    if (!hasLocale(lang)) notFound();
    const access = await getAdminAccess();

    if (access.status === "signed-out") {
        return (
            <Shell
                lang={lang}
                title="Admin access only."
                description="Sign in with the Discord account that's listed in ADMIN_DISCORD_IDS to moderate entries."
            >
                <div className={styles.cta}>
                    <AdminSignInButton />
                </div>
            </Shell>
        );
    }

    if (access.status === "forbidden") {
        return (
            <Shell lang={lang} title="No access." description={`Signed in as ${access.user.name}, but this isn't the admin account.`}>
                <div className={styles.cta}>
                    <SignOutButton />
                </div>
            </Shell>
        );
    }

    const admin = access.user;
    const entries = await db.select().from(guestbookEntries).orderBy(desc(guestbookEntries.createdAt));
    const pending = entries.filter((entry) => entry.status === "pending");
    const approved = entries.filter((entry) => entry.status === "approved");
    // Names on the start-lights board go live without review, so the top
    // of it is listed here to delete anything that shouldn't be there.
    const scores = await getLeaderboard(20);

    return (
        <Shell lang={lang} title="Moderate the pit wall." description={`Signed in as ${admin.name}.`}>

            <Section label={`Pending (${pending.length})`} title="Waiting for approval.">
                {pending.length === 0 ? (
                    <p className={`mut ${styles.empty}`}>Nothing pending.</p>
                ) : (
                    <div className={styles.list}>
                        {pending.map((entry) => (
                            <article key={entry.id} className={styles.entry}>
                                <div>
                                    <strong>{entry.displayName}</strong>
                                    <p>{entry.message}</p>
                                </div>
                                <div className={styles.actions}>
                                    <form action={approveEntry}>
                                        <input type="hidden" name="id" value={entry.id} />
                                        <button type="submit" className="btn btn-w">
                                            Approve
                                        </button>
                                    </form>
                                    <form action={deleteEntry}>
                                        <input type="hidden" name="id" value={entry.id} />
                                        <button type="submit" className={`btn btn-g ${styles.delete}`}>
                                            Delete
                                        </button>
                                    </form>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </Section>

            <Section label={`Approved (${approved.length})`} title="Live on the pit wall.">
                {approved.length === 0 ? (
                    <p className={`mut ${styles.empty}`}>Nothing live yet.</p>
                ) : (
                    <div className={styles.list}>
                        {approved.map((entry) => (
                            <article key={entry.id} className={styles.entry}>
                                <div>
                                    <strong>
                                        {entry.displayName}{" "}
                                        <span className="mut">
                                            {entry.authType === "discord" ? "Discord" : "Guest"}
                                        </span>
                                    </strong>
                                    <p>{entry.message}</p>
                                </div>
                                <div className={styles.actions}>
                                    <form action={deleteEntry}>
                                        <input type="hidden" name="id" value={entry.id} />
                                        <button type="submit" className={`btn btn-g ${styles.delete}`}>
                                            Delete
                                        </button>
                                    </form>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </Section>

            <Section label={`Start lights (top ${scores.length})`} title="Leaderboard names.">
                {scores.length === 0 ? (
                    <p className={`mut ${styles.empty}`}>No times yet.</p>
                ) : (
                    <div className={styles.list}>
                        {scores.map((score) => (
                            <article key={score.id} className={styles.entry}>
                                <div>
                                    <strong>{score.displayName}</strong>
                                    <p>{(score.reactionMs / 1000).toFixed(3)} s</p>
                                </div>
                                <div className={styles.actions}>
                                    <form action={deleteReactionScore}>
                                        <input type="hidden" name="id" value={score.id} />
                                        <button type="submit" className={`btn btn-g ${styles.delete}`}>
                                            Delete
                                        </button>
                                    </form>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </Section>
        </Shell>
    );
}
