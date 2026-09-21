import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, varchar, index } from "drizzle-orm/pg-core";

// --- better-auth tables -----------------------------------------------
// Generated from src/lib/auth.ts via `npx @better-auth/cli generate` and
// checked in as-is (plus the `discordId` additional field on `user`, which
// the CLI already picks up from the auth config). Re-run that command and
// diff instead of hand-editing these four tables if the auth config changes.
export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
    // Discord snowflake ID, populated at sign-in (see mapProfileToUser in
    // src/lib/auth.ts) - lets /guestbook/admin gate access without joining
    // through `account`.
    discordId: text("discord_id"),
});

export const session = pgTable(
    "session",
    {
        id: text("id").primaryKey(),
        expiresAt: timestamp("expires_at").notNull(),
        token: text("token").notNull().unique(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
        ipAddress: text("ip_address"),
        userAgent: text("user_agent"),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
    },
    (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
    "account",
    {
        id: text("id").primaryKey(),
        accountId: text("account_id").notNull(),
        providerId: text("provider_id").notNull(),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        accessToken: text("access_token"),
        refreshToken: text("refresh_token"),
        idToken: text("id_token"),
        accessTokenExpiresAt: timestamp("access_token_expires_at"),
        refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
        scope: text("scope"),
        password: text("password"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
    "verification",
    {
        id: text("id").primaryKey(),
        identifier: text("identifier").notNull(),
        value: text("value").notNull(),
        expiresAt: timestamp("expires_at").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
    sessions: many(session),
    accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id],
    }),
}));

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    }),
}));

// --- guestbook -----------------------------------------------------------

export const guestbookEntries = pgTable("guestbook_entries", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    displayName: varchar("display_name", { length: 40 }).notNull(),
    message: varchar("message", { length: 300 }).notNull(),
    authType: text("auth_type", { enum: ["anonymous", "discord"] }).notNull(),
    avatarUrl: text("avatar_url"),
    // Kept for admin/audit only - never rendered on the public page.
    discordUserId: text("discord_user_id"),
    status: text("status", { enum: ["pending", "approved"] }).notNull().default("pending"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Purely for anti-spam throttling, decoupled from guestbook_entries so the
// hashed IP can be deleted after 24h without touching the entries
// themselves (see src/lib/rate-limit.ts for the lazy-cleanup query).
export const guestbookRateLimits = pgTable("guestbook_rate_limits", {
    ipHash: text("ip_hash").primaryKey(),
    lastSubmittedAt: timestamp("last_submitted_at").notNull().defaultNow(),
});
