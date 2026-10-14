import { createHash } from "node:crypto";
import { lt } from "drizzle-orm";
import { db } from "@/db";
import { guestbookRateLimits, reactionRateLimits } from "@/db/schema";
import { RATE_LIMIT_RETENTION_MS, RATE_LIMIT_WINDOW_MS } from "./guestbook-constants";
import { REACTION_RATE_LIMIT_WINDOW_MS } from "./reaction-constants";

type RateLimitTable = typeof guestbookRateLimits | typeof reactionRateLimits;

function hashIp(ip: string): string {
    return createHash("sha256").update(`${process.env.IP_HASH_SALT ?? ""}:${ip}`).digest("hex");
}

// Returns true if this IP may submit now (and records the attempt), false
// if it's still inside the rate-limit window. Implemented as a single
// conditional upsert (insert, or update only if the existing row is older
// than the window) so concurrent requests can't both slip through.
async function checkAndRecord(table: RateLimitTable, ip: string, windowMs: number): Promise<boolean> {
    const now = new Date();

    // Lazy cleanup instead of a cron job: anything past the retention
    // window gets deleted as a side effect of the next rate-limit check.
    await db.delete(table).where(lt(table.lastSubmittedAt, new Date(now.getTime() - RATE_LIMIT_RETENTION_MS)));

    const windowCutoff = new Date(now.getTime() - windowMs);

    const result = await db
        .insert(table)
        .values({ ipHash: hashIp(ip), lastSubmittedAt: now })
        .onConflictDoUpdate({
            target: table.ipHash,
            set: { lastSubmittedAt: now },
            where: lt(table.lastSubmittedAt, windowCutoff),
        })
        .returning({ ipHash: table.ipHash });

    return result.length > 0;
}

export function checkAndRecordRateLimit(ip: string): Promise<boolean> {
    return checkAndRecord(guestbookRateLimits, ip, RATE_LIMIT_WINDOW_MS);
}

export function checkAndRecordReactionRateLimit(ip: string): Promise<boolean> {
    return checkAndRecord(reactionRateLimits, ip, REACTION_RATE_LIMIT_WINDOW_MS);
}
