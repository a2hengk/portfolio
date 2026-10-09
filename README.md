# Lunas — Portfolio

Personal portfolio, built to learn Next.js properly and to have something online that's actually mine instead of a template. BMW M / racing theme throughout, down to a couple of hidden easter eggs.

## Pages

- **Home** — hero, live-ish stats, contact
- **About** — background, skills ("gearbox")
- **Experience** — timeline laid out on a traced Nürburgring Nordschleife map
- **Projects** — builds and where each one stands, with expandable details
- **Guestbook ("Pit Wall")** — visitors leave a message, anonymously or signed in with Discord
- **Off Duty** — games, anime, and a start-lights reaction test with a top 5 leaderboard
- **Links**, **Uses**, **Legal**

## Tech stack

- [Next.js](https://nextjs.org/) (App Router) with [React](https://react.dev/) and TypeScript
- Plain CSS Modules / global CSS — no UI framework
- [Drizzle ORM](https://orm.drizzle.team/) with PostgreSQL ([Neon](https://neon.tech/) in production)
- [better-auth](https://www.better-auth.com/) for Discord OAuth
- [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) for spam protection
- Hosted on [Vercel](https://vercel.com/)

## Guestbook

The one part of this site with a real backend. Visitors can leave a note either anonymously (name only) or signed in with Discord (name + avatar pulled from Discord).

- **Moderation**: anonymous entries are held as `pending` until approved; Discord entries go live immediately. `/guestbook/admin` (not linked in navigation) lists pending/approved entries with approve/delete actions, gated to the Discord user IDs in `ADMIN_DISCORD_IDS`.
- **Spam protection**: every submission needs a valid Cloudflare Turnstile token, plus a per-IP rate limit (the IP itself is never stored — only a salted, one-way hash, kept for at most 24h and cleaned up lazily on the next check).
- **Auth**: better-auth with the Discord social provider. Chosen over Auth.js/NextAuth v5 because it has a stable release and an official Drizzle adapter, so the guestbook and the auth tables share one ORM and one migration flow.

## Start lights

Reaction test on `/off-duty`: five reds come on one per second, hold for a random 0.5–3s, then go green. The time from green to the press is the score; pressing early (or under 100 ms) is a jump start.

- **Measuring**: input is read on `pointerdown`/`keydown` using `event.timeStamp`, and green is set directly on the DOM inside `requestAnimationFrame`, so React rendering isn't part of the measured time.
- **Leaderboard**: one row per (case-insensitive) name, only replaced by a faster time; the page shows the top 5. Saving needs Turnstile and is rate-limited per hashed IP (same scheme as the guestbook, separate table). Names go live without review — the top 20 are listed with a delete button on `/guestbook/admin`.
- **Plausibility check**: the server hands out an HMAC-signed run token with the random hold baked in, and rejects a save if less than lights + hold + reaction time has passed since the token was issued. That stops posting a made-up time straight away, but it is **not** cheat-proof: the reaction itself is measured in the browser, so a script that waits for green can always win.

## Local development

```bash
npm install
docker compose up -d          # local Postgres for dev (matches DATABASE_URL below)
cp .env.example .env.local    # fill in the values, see table below
npm run db:migrate            # applies the schema
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Postgres connection string. Local: matches `docker-compose.yml`. Production: the pooled Neon connection string. |
| `BETTER_AUTH_SECRET` | Random secret (`openssl rand -base64 32`). |
| `BETTER_AUTH_URL` | Must match exactly where the app is being served from — `http://localhost:3000` locally, the canonical production URL (with or without `www`, whichever the domain actually resolves to) in prod. A mismatch here breaks the OAuth cookie/origin flow. |
| `DISCORD_CLIENT_ID` / `DISCORD_CLIENT_SECRET` | From a Discord Developer Portal application (OAuth2 tab). The redirect URI to register there is `<BETTER_AUTH_URL>/api/auth/callback/discord`. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | From a Cloudflare Turnstile widget for the domain(s) you're testing/serving from. |
| `ADMIN_DISCORD_IDS` | Comma-separated Discord user IDs allowed on `/guestbook/admin`. |
| `IP_HASH_SALT` | Random pepper mixed into the hashed IP used for guestbook rate-limiting. Should differ between local/dev and production. |
| `REACTION_TOKEN_SECRET` | Optional. Signs start-lights run tokens; falls back to `BETTER_AUTH_SECRET` if unset. |

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run lint` / `npm run lint:fix` | ESLint |
| `npm run db:generate` | Generate a Drizzle migration from `src/db/schema.ts` |
| `npm run db:migrate` | Apply migrations to `DATABASE_URL` |
