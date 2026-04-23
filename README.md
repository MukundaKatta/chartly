# Chartly

> Your AI scribe for the exam room.

Listens to the patient conversation. Writes the SOAP note. Cuts physicians' documentation time by 75%.

## Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict)
- **Styles:** Tailwind CSS v4
- **Runtime:** Node.js via Vercel

## Run locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

Push to `main` — Vercel auto-deploys. No environment variables required for the v0 skeleton.

## Routes

| Route | Description |
|---|---|
| `/` | Landing page with waitlist form |
| `/try` | Interactive demo — paste a dialog, get a SOAP note |
| `/api/waitlist` | `POST { email }` → proxies to waitlist API |

## Status

v0 skeleton. The `/try` page uses keyword rules to mock SOAP note generation. Real AI inference coming post-launch.

- **Live:** https://mukundakatta.github.io/chartly/
- **Waitlist API:** https://waitlist-api-sigma.vercel.app/api/waitlist
