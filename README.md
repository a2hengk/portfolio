# Lunas — Portfolio

Personal portfolio, built to learn Next.js properly and to have something online that's actually mine instead of a template. BMW M / racing theme throughout, down to a couple of hidden easter eggs.

## Pages

- **Home** — hero, live-ish stats, contact
- **About** — background, skills ("gearbox")
- **Experience** — timeline laid out on a traced Nürburgring Nordschleife map
- **Projects** — builds and where each one stands, with expandable details
- **Guestbook ("Pit Wall")** — visitors leave a message, anonymously or signed in with Discord
- **Off Duty**, **Links**, **Uses**, **Legal**

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

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run lint` / `npm run lint:fix` | ESLint |
| `npm run db:generate` | Generate a Drizzle migration from `src/db/schema.ts` |
| `npm run db:migrate` | Apply migrations to `DATABASE_URL` |
