import "dotenv/config";
import { betterAuth } from "better-auth";
import { pool } from "./db/pool.js";

/**
 * The authentication configuration for the application, using Better Auth with a PostgreSQL database.
 */
export const auth = betterAuth({
  database: pool,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  trustedOrigins: [process.env.CLIENT_URL ?? 'http://localhost:5173'],
  // socialProviders: {
  //   google: {
  //     clientId: process.env.GOOGLE_CLIENT_ID as string,
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  //   },
  //   github: {
  //     clientId: process.env.GITHUB_CLIENT_ID as string,
  //     clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
  //   },
  // },
});