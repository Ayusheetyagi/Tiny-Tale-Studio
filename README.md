# Storybook Studio

An AI-powered children's storybook generator. Parents fill in a short profile about their child,
and Gemini turns it into a 5-page illustrated story. Each page gets its own illustration,
generated on the fly using Pollinations AI.

Why I built this

I love reading to my toddler. Most children's stories are about someone else's kid — fun for
them, but I felt it could be made more personal. I wanted to try the opposite: a story where
your child, their pet, and their friends are the actual characters.

I also wanted to see how far I could take a fast AI writing and illustration pipeline without
making it slow or expensive.

With this product, my toddler got so excited for storytime, so engaged — and I've also been able
to communicate better with my kiddo using stories.

Who it's for

Parents who want to create something personal and fun for their child in a few minutes, without
having to write or design the story themselves.

The tradeoffs I made

Product
- Free image generation instead of a paid API. I used Pollinations AI's free, keyless image
  endpoint, which means there's no cost or setup. The tradeoff is reliability: it only allows
  one image request at a time per IP, so the story's pages have to be generated one by one.
- Built-in text-to-speech instead of another service. The read-aloud feature uses the browser's
  built-in `speechSynthesis`. Voice quality can vary between browsers, but it keeps the app free
  and avoids another service or backend to manage.
- No database or stored personal information. Nothing is saved in a database. Parents may share
  details like their child's age, interests, or other personal information to personalize the
  story, so I chose not to store any of it. The tradeoff is that parents have to enter the
  information again each time they use the app — for an MVP, I felt that was the better choice
  than building storage, accounts, and all the privacy and compliance features that come with
  handling children's personal information.

AI
- Rate limit to prevent spam and unexpected costs. Each story can trigger two Gemini calls.
  Since there's no login, someone could repeatedly hit the generate button or automate requests
  and quickly run up costs — so the app limits each user to 10 storybooks every 15 minutes.
  That's much more than a normal user would need, and it's mainly there to protect against spam
  and bots.
- Two safety checks instead of one. The story prompt already asks the AI to keep things
  appropriate, but I run a second check on the finished story. This adds some time and cost, but
  gives an extra layer of protection if the story drifts from the original instructions.
- If a story is flagged, I try again once. Instead of editing the flagged story, the app throws
  it away and generates a completely new one. That new story is checked again — if it gets
  flagged twice, the request is rejected.
- I'd rather block something questionable than let it through. The safety check is intentionally
  cautious, even when something is only mildly or possibly inappropriate. If the safety check
  itself fails, the story is blocked too. This can mean rejecting some harmless requests, but it
  reduces the chance of questionable content getting through.
- No "are you sure?" warnings. The user either gets a story or a rejection — I didn't want to
  show potentially inappropriate content with a warning and leave the decision to the parent.
- No formal eval yet. I manually tested a number of stories to check both story quality and
  moderation before trusting the pipeline.

What I'd do differently

The biggest limitation right now is image generation. Because only one image can be generated at
a time, creating a full story can get slow as usage grows. If I took this further, that's
probably the first thing I'd solve — most likely by moving to a paid image-generation service
once there was enough evidence that people actually wanted to use the product regularly.

---

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
- No accounts or database — nothing about the child's profile or the generated story is
  stored on the server. Parents can download and print the finished storybook to keep it.
