import { headers } from "next/headers";

// Shared by the guestbook and the start-lights leaderboard. Behind Vercel the
// first x-forwarded-for hop is the real client.
export async function getClientIp(): Promise<string> {
    const requestHeaders = await headers();
    const forwardedFor = requestHeaders.get("x-forwarded-for");
    if (forwardedFor) {
        return forwardedFor.split(",")[0]!.trim();
    }
    return requestHeaders.get("x-real-ip") ?? "unknown";
}
