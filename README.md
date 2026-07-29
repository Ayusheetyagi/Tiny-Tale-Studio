# Storybook Studio

An AI-powered children's storybook generator. Parents fill in a short profile for their
child, and Gemini writes a cohesive 5-page illustrated story, with each page's scene
rendered on the fly by Pollinations AI.

## Structure

- `client/` — Vite + React + TypeScript + Tailwind CSS frontend
- `server/` — Express + TypeScript backend calling the Gemini API (`@google/genai`)

## Setup

```bash
npm install          # installs both workspaces
cp server/.env.example server/.env
# edit server/.env and set GEMINI_API_KEY=<your key>
npm run dev           # runs server (:8787) and client (:5173) together
```

Open http://localhost:5173. The Vite dev server proxies `/api/*` requests to the
Express backend.

## Build

```bash
npm run build
```

Builds the server to `server/dist` and the client to `client/dist`. In production the
Express server serves the built client directly (see `server/src/index.ts`) — everything
runs as a single deployable service on one port, with `/api/*` routed to the backend and
everything else served as the static React app.

```bash
npm run build
npm start        # runs the compiled server, serving both API and client on $PORT
```

## Deploy (Render)

This repo includes a `render.yaml` blueprint.

1. Push this repo to GitHub.
2. In Render, choose **New > Blueprint**, point it at the repo — it will pick up
   `render.yaml` automatically (build command `npm install && npm run build`, start
   command `npm run start`).
3. Set the `GEMINI_API_KEY` environment variable in the Render dashboard (it's marked
   `sync: false` in the blueprint, so Render will prompt for it rather than expecting it
   in the repo).
4. Deploy. The free plan spins down after inactivity (a first request after idling takes
   ~30-60s to wake back up); upgrade to a paid instance type to keep it always-on.

Any other Node host works the same way — the only requirements are running
`npm install && npm run build` then `npm run start`, and providing `GEMINI_API_KEY` as an
environment variable (never commit it).

## Notes

- Illustrations are generated at request time via Pollinations AI's free, keyless image
  endpoint — no API key required for images. All 5 pages of a story share one Pollinations
  seed for cross-page art consistency, and generation runs strictly one request at a time
  (Pollinations' anonymous tier allows only one in-flight request per IP).
- Read-aloud uses the browser's built-in `window.speechSynthesis`, so no external TTS
  service is needed.
- `/api/generate-story` is rate-limited (10 requests / 15 min per IP) since each request
  can trigger up to 2 Gemini calls for content moderation.
