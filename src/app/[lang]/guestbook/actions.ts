"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { guestbookEntries } from "@/db/schema";
import { auth } from "@/lib/auth";
import { getAdminUser } from "@/lib/admin";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { checkAndRecordRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/client-ip";
import { DISPLAY_NAME_MAX_LENGTH, MESSAGE_MAX_LENGTH } from "@/lib/guestbook-constants";

const anonymousSchema = z.object({
    displayName: z
        .string()
        .trim()
        .min(1, "nameRequired")
        .max(DISPLAY_NAME_MAX_LENGTH, "nameTooLong"),
    message: z
        .string()
        .trim()
        .min(1, "messageRequired")
        .max(MESSAGE_MAX_LENGTH, "messageTooLong"),
    turnstileToken: z.string().min(1, "spamCheckMissing"),
});

const discordSchema = z.object({
    message: z
        .string()
        .trim()
        .min(1, "messageRequired")
        .max(MESSAGE_MAX_LENGTH, "messageTooLong"),
    turnstileToken: z.string().min(1, "spamCheckMissing"),
});

// `error` is a key into guestbook.form.errors in the dictionaries - the
// form translates it, so the action doesn't need to know the language.
export type SubmitEntryState = {
    error?: string;
    success?: boolean;
};

export async function submitEntry(_prevState: SubmitEntryState, formData: FormData): Promise<SubmitEntryState> {
    const session = await auth.api.getSession({ headers: await headers() });
    const ip = await getClientIp();

    // Coerce a missing field to "" rather than leaving it null - null fails
    // Zod's string type check itself (raw "expected string, received null"),
    // bypassing the friendly min-length messages below entirely.
    const raw = {
        displayName: formData.get("displayName")?.toString() ?? "",
        message: formData.get("message")?.toString() ?? "",
        turnstileToken: formData.get("cf-turnstile-response")?.toString() ?? "",
    };

    const parsed = session ? discordSchema.safeParse(raw) : anonymousSchema.safeParse(raw);

    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message ?? "invalid" };
    }

    const turnstileOk = await verifyTurnstileToken(parsed.data.turnstileToken, ip);
    if (!turnstileOk) {
        return { error: "spamCheckFailed" };
    }

    const allowed = await checkAndRecordRateLimit(ip);
    if (!allowed) {
        return { error: "rateLimited" };
    }

    if (session) {
        await db.insert(guestbookEntries).values({
            displayName: session.user.name,
            message: parsed.data.message,
            authType: "discord",
            avatarUrl: session.user.image ?? null,
            discordUserId: session.user.discordId ?? null,
            status: "approved",
        });
    } else {
        const { displayName, message } = parsed.data as z.infer<typeof anonymousSchema>;
        await db.insert(guestbookEntries).values({
            displayName,
            message,
            authType: "anonymous",
            status: "pending",
        });
    }

    revalidatePath("/[lang]/guestbook", "page");
    return { success: true };
}

export async function approveEntry(formData: FormData): Promise<void> {
    const admin = await getAdminUser();
    if (!admin) {
        return;
    }

    const id = formData.get("id");
    if (typeof id !== "string" || !id) {
        return;
    }

    await db.update(guestbookEntries).set({ status: "approved" }).where(eq(guestbookEntries.id, id));
    revalidatePath("/[lang]/guestbook", "page");
    revalidatePath("/[lang]/guestbook/admin", "page");
}

export async function deleteEntry(formData: FormData): Promise<void> {
    const admin = await getAdminUser();
    if (!admin) {
        return;
    }

    const id = formData.get("id");
    if (typeof id !== "string" || !id) {
        return;
    }

    await db.delete(guestbookEntries).where(eq(guestbookEntries.id, id));
    revalidatePath("/[lang]/guestbook", "page");
    revalidatePath("/[lang]/guestbook/admin", "page");
}
