import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { toNodeHandler } from "better-auth/node";

import { auth } from "./auth.js";
import { pool } from "./db/pool.js";

import user from "./routes/user.js";
import profile from "./routes/profile.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, "../dist");

const app = express();

// If the environment is not production, enable CORS for dev
if (process.env.NODE_ENV !== "production") {
  app.use(cors({
    origin: process.env.CLIENT_URL ?? "http://localhost:5173",
    credentials: true,
  }));
}

// Handle authentication routes using Better Auth
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

// Test route
app.get("/api/health", async (_req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json({ ok: true, time: result.rows[0].now });
});

// Profile routes
app.use("/api/profile", profile);

// User routes
app.use("/api/me", user);

// Catch-all for unknown API routes
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Serve the built React app
app.use(express.static(distPath));
app.get("/*splat", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Centralized error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {

  // PostgreSQL unique constraint violation error code
  if (err.code === "23505" && err.constraint === "profile_username_lower_idx") {
    return res.status(409).json({ error: "That username is taken" });
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));