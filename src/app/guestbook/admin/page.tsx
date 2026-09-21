import { desc } from "drizzle-orm";
import PageIntro from "@/components/PageIntro";
import { db } from "@/db";
import { guestbookEntries } from "@/db/schema";
import { getAdminAccess } from "@/lib/admin";
import { approveEntry, deleteEntry } from "../actions";
import AdminSignInButton from "./SignInButton";
import SignOutButton from "./SignOutButton";

export const metadata = {
    title: "Pit Wall Admin - Lunas",
    robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function SignedOutPrompt() {
    return (
        <main id="top" className="route-page">
            <PageIntro
                eyebrow="Pit Wall"
                title="Admin access only."
                description="Sign in with the Discord account that's listed in ADMIN_DISCORD_IDS to moderate entries."
            />
            <section className="route-section">
                <AdminSignInButton />
            </section>
        </main>
    );
}

function ForbiddenNotice({ name }: { name: string }) {
    return (
        <main id="top" className="route-page">
            <PageIntro
                eyebrow="Pit Wall"
                title="No access."
                description={`Signed in as ${name}, but this isn't the admin account.`}
            />
            <section className="route-section">
                <SignOutButton />
            </section>
        </main>
    );
}

export default async function GuestbookAdminPage() {
    const access = await getAdminAccess();

    if (access.status === "signed-out") {
        return <SignedOutPrompt />;
    }

    if (access.status === "forbidden") {
        return <ForbiddenNotice name={access.user.name} />;
    }

    const admin = access.user;
    const entries = await db.select().from(guestbookEntries).orderBy(desc(guestbookEntries.createdAt));
    const pending = entries.filter((entry) => entry.status === "pending");
    const approved = entries.filter((entry) => entry.status === "approved");

    return (
        <main id="top" className="route-page">
            <PageIntro
                eyebrow="Pit Wall"
                title="Moderate the pit wall."
                description={`Signed in as ${admin.name}.`}
            />

            <section className="route-section">
                <div className="section__heading">
                    <p className="eyebrow">Pending ({pending.length})</p>
                    <h2>Waiting for approval.</h2>
                </div>
                {pending.length === 0 ? (
                    <p className="guestbook-empty">Nothing pending.</p>
                ) : (
                    <div className="guestbook-admin-list">
                        {pending.map((entry) => (
                            <article key={entry.id} className="guestbook-admin-entry">
                                <div>
                                    <strong>{entry.displayName}</strong>
                                    <p>{entry.message}</p>
                                </div>
                                <div className="guestbook-admin-entry__actions">
                                    <form action={approveEntry}>
                                        <input type="hidden" name="id" value={entry.id} />
                                        <button type="submit" className="guestbook-admin-entry__approve">
                                            Approve
                                        </button>
                                    </form>
                                    <form action={deleteEntry}>
                                        <input type="hidden" name="id" value={entry.id} />
                                        <button type="submit" className="guestbook-admin-entry__delete">
                                            Delete
                                        </button>
                                    </form>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            <section className="route-section">
                <div className="section__heading">
                    <p className="eyebrow">Approved ({approved.length})</p>
                    <h2>Live on the pit wall.</h2>
                </div>
                {approved.length === 0 ? (
                    <p className="guestbook-empty">Nothing live yet.</p>
                ) : (
                    <div className="guestbook-admin-list">
                        {approved.map((entry) => (
                            <article key={entry.id} className="guestbook-admin-entry">
                                <div>
                                    <strong>
                                        {entry.displayName}{" "}
                                        <span className="guestbook-entry__source">
                                            {entry.authType === "discord" ? "Discord" : "Guest"}
                                        </span>
                                    </strong>
                                    <p>{entry.message}</p>
                                </div>
                                <div className="guestbook-admin-entry__actions">
                                    <form action={deleteEntry}>
                                        <input type="hidden" name="id" value={entry.id} />
                                        <button type="submit" className="guestbook-admin-entry__delete">
                                            Delete
                                        </button>
                                    </form>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
