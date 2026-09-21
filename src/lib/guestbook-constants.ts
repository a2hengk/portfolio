export const DISPLAY_NAME_MAX_LENGTH = 40;
export const MESSAGE_MAX_LENGTH = 300;

// Minimum time between two submissions from the same hashed IP.
export const RATE_LIMIT_WINDOW_MS = 3 * 60 * 1000;

// How long a rate-limit row is kept before it's eligible for lazy cleanup.
export const RATE_LIMIT_RETENTION_MS = 24 * 60 * 60 * 1000;

export const GUESTBOOK_ENTRIES_LIMIT = 50;

export function adminDiscordIds(): string[] {
    return (process.env.ADMIN_DISCORD_IDS ?? "")
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean);
}
