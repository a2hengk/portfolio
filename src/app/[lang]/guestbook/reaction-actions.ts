"use server";

import { revalidatePath } from "next/cache";
import { eq, gt } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { reactionScores } from "@/db/schema";
import { getAdminUser } from "@/lib/admin";
import { getClientIp } from "@/lib/client-ip";
import { checkAndRecordReactionRateLimit } from "@/lib/rate-limit";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { getLeaderboard, type LeaderboardEntry } from "@/lib/reaction-leaderboard";
import { issueRunToken, readRunToken } from "@/lib/reaction-token";
import {
    LIGHTS_SEQUENCE_MS,
    MAX_SAVED_REACTION_MS,
    MIN_REACTION_MS,
    PLAYER_NAME_MAX_LENGTH,
    PLAYER_NAME_PATTERN,
} from "@/lib/reaction-constants";

// Timer granularity / rounding headroom for the "did this run really take
// that long" check. The client only starts the lights after the token
// arrives, so an honest run is always slower than the server-side minimum.
const TIMING_SLACK_MS = 150;

export type StartRunResult = { token: string; holdMs: number } | { error: string };

export async function startRun(): Promise<StartRunResult> {
    try {
        return issueRunToken();
    } catch {
        // Missing secret etc. - the game still works locally, just unranked.
        return { error: "Leaderboard is offline right now." };
    }
}

const submitSchema = z.object({
    token: z.string().min(1).max(512),
    reactionMs: z
        .number()
        .int()
        .min(MIN_REACTION_MS, "jumpStart")
        .max(MAX_SAVED_REACTION_MS, "tooSlow"),
    name: z
        .string()
        .transform((value) => value.normalize("NFKC").trim().replace(/\s+/g, " "))
        .pipe(
            z
                .string()
                .min(1, "nameRequired")
                .max(PLAYER_NAME_MAX_LENGTH, "nameTooLong")
                .regex(PLAYER_NAME_PATTERN, "nameInvalid"),
        ),
    turnstileToken: z.string().min(1, "spamCheckMissing"),
});

// `error` is a key into guestbook.startLights.errors in the dictionaries.
export type SubmitTimeResult =
    | { ok: true; improved: boolean; leaderboard: LeaderboardEntry[] }
    | { ok: false; error: string };

export async function submitTime(input: {
    token: string;
    reactionMs: number;
    name: string;
    turnstileToken: string;
}): Promise<SubmitTimeResult> {
    const parsed = submitSchema.safeParse(input);
    if (!parsed.success) {
        return { ok: false, error: parsed.error.issues[0]?.message ?? "invalid" };
    }
    const { token, reactionMs, name, turnstileToken } = parsed.data;

    const run = readRunToken(token);
    if (!run) {
        return { ok: false, error: "runExpired" };
    }

    const elapsed = Date.now() - run.iat;
    if (elapsed + TIMING_SLACK_MS < LIGHTS_SEQUENCE_MS + run.hold + reactionMs) {
        return { ok: false, error: "runInvalid" };
    }

    const ip = await getClientIp();

    const turnstileOk = await verifyTurnstileToken(turnstileToken, ip);
    if (!turnstileOk) {
        return { ok: false, error: "spamCheckFailed" };
    }

    const allowed = await checkAndRecordReactionRateLimit(ip);
    if (!allowed) {
        return { ok: false, error: "rateLimited" };
    }

    // One row per (case-insensitive) name, only overwritten by a faster time.
    const saved = await db
        .insert(reactionScores)
        .values({ nameKey: name.toLowerCase(), displayName: name, reactionMs })
        .onConflictDoUpdate({
            target: reactionScores.nameKey,
            set: { displayName: name, reactionMs },
            where: gt(reactionScores.reactionMs, reactionMs),
        })
        .returning({ id: reactionScores.id });

    revalidatePath("/[lang]/guestbook", "page");

    return { ok: true, improved: saved.length > 0, leaderboard: await getLeaderboard() };
}

export async function deleteReactionScore(formData: FormData): Promise<void> {
    const admin = await getAdminUser();
    if (!admin) {
        return;
    }

    const id = formData.get("id");
    if (typeof id !== "string" || !id) {
        return;
    }

    await db.delete(reactionScores).where(eq(reactionScores.id, id));
    revalidatePath("/[lang]/guestbook", "page");
    revalidatePath("/[lang]/guestbook/admin", "page");
}
