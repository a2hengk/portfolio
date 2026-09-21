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
import { DISPLAY_NAME_MAX_LENGTH, MESSAGE_MAX_LENGTH } from "@/lib/guestbook-constants";

async function getClientIp(): Promise<string> {
    const requestHeaders = await headers();
    const forwardedFor = requestHeaders.get("x-forwarded-for");
    if (forwardedFor) {
        return forwardedFor.split(",")[0]!.trim();
    }
    return requestHeaders.get("x-real-ip") ?? "unknown";
}

const anonymousSchema = z.object({
    displayName: z.string().trim().min(1).max(DISPLAY_NAME_MAX_LENGTH),
    message: z.string().trim().min(1).max(MESSAGE_MAX_LENGTH),
    turnstileToken: z.string().min(1, "Please complete the spam check."),
});

const discordSchema = z.object({
    message: z.string().trim().min(1).max(MESSAGE_MAX_LENGTH),
    turnstileToken: z.string().min(1, "Please complete the spam check."),
});

export type SubmitEntryState = {
    error?: string;
    success?: boolean;
};

export async function submitEntry(_prevState: SubmitEntryState, formData: FormData): Promise<SubmitEntryState> {
    const session = await auth.api.getSession({ headers: await headers() });
    const ip = await getClientIp();

    const raw = {
        displayName: formData.get("displayName"),
        message: formData.get("message"),
        turnstileToken: formData.get("cf-turnstile-response"),
    };

    const parsed = session ? discordSchema.safeParse(raw) : anonymousSchema.safeParse(raw);

    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message ?? "Please check your message and try again." };
    }

    const turnstileOk = await verifyTurnstileToken(parsed.data.turnstileToken, ip);
    if (!turnstileOk) {
        return { error: "Spam check failed - please try again." };
    }

    const allowed = await checkAndRecordRateLimit(ip);
    if (!allowed) {
        return { error: "You're posting too quickly - try again in a few minutes." };
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

    revalidatePath("/guestbook");
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
    revalidatePath("/guestbook");
    revalidatePath("/guestbook/admin");
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
    revalidatePath("/guestbook");
    revalidatePath("/guestbook/admin");
}
