import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { HOLD_MAX_MS, HOLD_MIN_MS, RUN_TOKEN_TTL_MS } from "./reaction-constants";

// A run token is "<base64url payload>.<base64url hmac>". The payload holds
// when the server handed out the run and the random hold it picked. On save
// we check that at least lights + hold + reaction time has really passed
// since then, so a time can't just be POSTed without sitting through a run.
//
// This does NOT make the leaderboard cheat-proof: the reaction itself is
// measured in the browser, so a script that waits for green and "clicks"
// after 100ms will always win. It only stops the lazy kind of faking.

type RunPayload = {
    // Issued at (ms since epoch, server clock).
    iat: number;
    // Hold with all reds lit before green.
    hold: number;
};

function secret(): string {
    const value = process.env.REACTION_TOKEN_SECRET ?? process.env.BETTER_AUTH_SECRET;
    if (!value) {
        throw new Error("REACTION_TOKEN_SECRET (or BETTER_AUTH_SECRET) must be set");
    }
    return value;
}

function sign(payload: string): string {
    // Domain-separated so a token here can never double as anything auth-related.
    return createHmac("sha256", secret()).update(`start-lights:${payload}`).digest("base64url");
}

export function issueRunToken(): { token: string; holdMs: number } {
    const payload: RunPayload = {
        iat: Date.now(),
        hold: randomInt(HOLD_MIN_MS, HOLD_MAX_MS + 1),
    };
    const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
    return { token: `${encoded}.${sign(encoded)}`, holdMs: payload.hold };
}

export function readRunToken(token: string): RunPayload | null {
    const [encoded, signature] = token.split(".");
    if (!encoded || !signature) {
        return null;
    }

    const expected = Buffer.from(sign(encoded));
    const actual = Buffer.from(signature);
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
        return null;
    }

    try {
        const payload = JSON.parse(Buffer.from(encoded, "base64url").toString()) as RunPayload;
        if (typeof payload.iat !== "number" || typeof payload.hold !== "number") {
            return null;
        }
        if (Date.now() - payload.iat > RUN_TOKEN_TTL_MS) {
            return null;
        }
        return payload;
    } catch {
        return null;
    }
}
