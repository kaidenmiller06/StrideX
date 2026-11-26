import "dotenv/config";
import express from "express";
import path from "path";

import { createServer } from 'http';
import { fileURLToPath } from "url";
import { toNodeHandler } from "better-auth/node";

import { auth } from "./auth.js";
import { pool } from "./db/pool.js";
import { initSocket } from "./socket.js";

import user from "./routes/user.js";
import profile from "./routes/profile.js";
import connection from "./routes/connection.js";
import message from "./routes/message.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, "../dist");

const app = express();
const httpServer = createServer(app);
initSocket(httpServer);

app.use(express.json());

// Authentication routes (Better Auth)
app.all("/api/auth/*splat", toNodeHandler(auth));

// Test route
app.get("/api/health", async (_req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json({ ok: true, time: result.rows[0].now });
});

// Database routes (profile, user, connection, message)
app.use("/api/profile", profile);
app.use("/api/me", user);
app.use("/api/connection", connection);
app.use("/api/message", message);

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
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));