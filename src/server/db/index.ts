import { drizzle } from "drizzle-orm/neon-http";
import { type NeonQueryFunction, neon } from "@neondatabase/serverless";

import { env } from "~/env";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);
const globalForDb = globalThis as unknown as {
  conn: NeonQueryFunction<false, false> | undefined;
};

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const conn = globalForDb.conn ?? sql;
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
