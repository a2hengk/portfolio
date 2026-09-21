import { headers } from "next/headers";
import { auth } from "./auth";
import { adminDiscordIds } from "./guestbook-constants";

// Used both by /guestbook/admin (to gate the page) and by the approve/
// delete server actions (defense in depth - actions are reachable directly,
// not just through whatever the page happens to render).
export async function getAdminUser() {
    const session = await auth.api.getSession({ headers: await headers() });
    const discordId = session?.user.discordId;

    if (!session || !discordId || !adminDiscordIds().includes(discordId)) {
        return null;
    }

    return session.user;
}
