import "dotenv/config";
import pg from "pg";

/**
 * The PostgreSQL connection pool for the application.
 */
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});