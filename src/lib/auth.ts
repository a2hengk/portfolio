import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
    // Listed explicitly rather than relying solely on BETTER_AUTH_URL to
    // supply the www origin - production logs showed "Invalid origin:
    // https://www.about-lunas.dev" being rejected even though that's the
    // domain the site actually serves from, which means baseURL alone
    // wasn't reliably covering it. Both variants are trusted here so a
    // BETTER_AUTH_URL mismatch can't silently break sign-in/sign-out again.
    trustedOrigins: ["https://www.about-lunas.dev", "https://about-lunas.dev"],
    socialProviders: {
        discord: {
            clientId: process.env.DISCORD_CLIENT_ID as string,
            clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
            // Keep the Discord snowflake ID around directly on `user` so
            // /guestbook/admin can gate access without joining `account`.
            mapProfileToUser: (profile) => ({
                discordId: profile.id,
            }),
        },
    },
    user: {
        additionalFields: {
            discordId: {
                type: "string",
                required: false,
                // better-auth filters out any additionalField with input:false
                // before it ever reaches the DB write - including values that
                // came from mapProfileToUser, not just values from a public
                // form. This field is never user-submitted (there's no signup
                // form for it, only the Discord OAuth callback sets it), so
                // input:true here doesn't open it up to arbitrary client input.
                input: true,
            },
        },
    },
});
