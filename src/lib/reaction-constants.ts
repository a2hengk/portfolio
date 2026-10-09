// Shared between the client game and the server actions - keep this file
// free of server-only imports.

export const LIGHT_COUNT = 5;
// Pause between arming and the first red light, then one more light every
// LIGHT_INTERVAL_MS (F1 uses one per second).
export const FIRST_LIGHT_DELAY_MS = 700;
export const LIGHT_INTERVAL_MS = 1000;
// Time from the start of the sequence until all five reds are lit.
export const LIGHTS_SEQUENCE_MS = FIRST_LIGHT_DELAY_MS + (LIGHT_COUNT - 1) * LIGHT_INTERVAL_MS;

// Random hold with all five reds lit before they go green. Picked by the
// server so it can later check the run actually took that long.
export const HOLD_MIN_MS = 500;
export const HOLD_MAX_MS = 3000;

// Anything faster isn't a reaction, it's a guess - treated as a jump start.
export const MIN_REACTION_MS = 100;
// Slower than this is still shown, just not saved.
export const MAX_SAVED_REACTION_MS = 1500;

export const LEADERBOARD_SIZE = 5;

export const PLAYER_NAME_MAX_LENGTH = 16;
// Letters (any script), digits, space, dot, underscore, dash.
export const PLAYER_NAME_PATTERN = /^[\p{L}\p{N} ._-]+$/u;

// A run token is only valid this long after it was issued.
export const RUN_TOKEN_TTL_MS = 2 * 60 * 1000;
// Minimum time between two saved times from the same hashed IP.
export const REACTION_RATE_LIMIT_WINDOW_MS = 20 * 1000;
