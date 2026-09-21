import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Unlike `next dev`/`next build`, the drizzle-kit CLI doesn't load
// .env.local on its own - it needs to be loaded explicitly here so
// `npm run db:generate`/`db:migrate` work without manually sourcing it.
config({ path: ".env.local" });

export default defineConfig({
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
