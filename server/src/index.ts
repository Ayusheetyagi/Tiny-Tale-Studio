import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import { generateStoryRouter } from "./routes/generateStory.js";
import { charactersRouter } from "./routes/characters.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_DIST_DIR = path.join(__dirname, "..", "..", "client", "dist");

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 8787;

// Render (and most PaaS hosts) sit behind a reverse proxy — this is required
// for express-rate-limit to see the real client IP via X-Forwarded-For
// instead of rate-limiting every visitor as the same address.
app.set("trust proxy", 1);

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", generateStoryRouter);
app.use("/api", charactersRouter);

// Serve the built React app (production only — in local dev, Vite's own
// dev server on :5173 handles the client instead). Mounted after the /api
// routes so it never intercepts an API request.
app.use(express.static(CLIENT_DIST_DIR));
app.get(/^(?!\/api).*/, (_req, res) => {
  res.sendFile(path.join(CLIENT_DIST_DIR, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Storybook server listening on http://localhost:${PORT}`);
});
