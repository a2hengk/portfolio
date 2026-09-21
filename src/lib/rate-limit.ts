import { createHash } from "node:crypto";
import { lt } from "drizzle-orm";
import { db } from "@/db";
import { guestbookRateLimits } from "@/db/schema";
import { RATE_LIMIT_RETENTION_MS, RATE_LIMIT_WINDOW_MS } from "./guestbook-constants";

function hashIp(ip: string): string {
    return createHash("sha256").update(`${process.env.IP_HASH_SALT ?? ""}:${ip}`).digest("hex");
}

// Returns true if this IP may submit now (and records the attempt), false
// if it's still inside the rate-limit window. Implemented as a single
// conditional upsert (insert, or update only if the existing row is older
// than the window) so concurrent requests can't both slip through.
export async function checkAndRecordRateLimit(ip: string): Promise<boolean> {
    const now = new Date();

    // Lazy cleanup instead of a cron job: anything past the retention
    // window gets deleted as a side effect of the next rate-limit check.
    await db
        .delete(guestbookRateLimits)
        .where(lt(guestbookRateLimits.lastSubmittedAt, new Date(now.getTime() - RATE_LIMIT_RETENTION_MS)));

    const windowCutoff = new Date(now.getTime() - RATE_LIMIT_WINDOW_MS);

    const result = await db
        .insert(guestbookRateLimits)
        .values({ ipHash: hashIp(ip), lastSubmittedAt: now })
        .onConflictDoUpdate({
            target: guestbookRateLimits.ipHash,
            set: { lastSubmittedAt: now },
            where: lt(guestbookRateLimits.lastSubmittedAt, windowCutoff),
        })
        .returning({ ipHash: guestbookRateLimits.ipHash });

    return result.length > 0;
}
