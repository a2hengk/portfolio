import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Standard `pg` driver rather than Neon's HTTP driver: it talks to Neon's
// normal Postgres wire protocol just fine (point DATABASE_URL at the pooled
// connection string in prod) and, unlike the HTTP driver, also works
// unmodified against the local docker-compose Postgres used for dev/testing.
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = drizzle(pool, { schema });
