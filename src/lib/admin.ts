import { headers } from "next/headers";
import { auth } from "./auth";
import { adminDiscordIds } from "./guestbook-constants";

type Session = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;
type SessionUser = Session["user"];

export type AdminAccess =
    | { status: "signed-out" }
    | { status: "forbidden"; user: SessionUser }
    | { status: "authorized"; user: SessionUser };

// Used by /guestbook/admin, which needs to tell "not signed in" apart from
// "signed in, but not the admin account" so it never re-triggers the
// Discord login for someone who already has a (non-admin) session.
export async function getAdminAccess(): Promise<AdminAccess> {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
        return { status: "signed-out" };
    }

    const discordId = session.user.discordId;
    if (!discordId || !adminDiscordIds().includes(discordId)) {
        return { status: "forbidden", user: session.user };
    }

    return { status: "authorized", user: session.user };
}

// Used by the approve/delete server actions, which only care about
// admin-or-not - defense in depth, independent of whatever the page renders.
export async function getAdminUser(): Promise<SessionUser | null> {
    const access = await getAdminAccess();
    return access.status === "authorized" ? access.user : null;
}
