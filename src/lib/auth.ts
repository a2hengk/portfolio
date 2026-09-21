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
                input: false,
            },
        },
    },
});
