import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const u = new URL(process.env.DATABASE_URL!);
console.log("DB host:", u.host, "user:", u.username, "pw length:", u.password.length);

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  // ssl: process.env.DATABASE_URL?.includes("proxy.rlwy.net")
  //   ? { rejectUnauthorized: false }
  //   : undefined,
});

const app = express();
app.use(express.json());

// test route
app.get("/api/health", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ ok: true, time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false });
  }
});

// serve the built React app
app.use(express.static(path.join(__dirname, "dist")));
app.use((_req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Process port from railway environment variable or default to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));