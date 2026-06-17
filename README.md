# AskMonty 🐑

Your friendly guide to the French financial system.

## Setup

1. Copy `.env.example` to `.env` and fill in your keys
2. Run `npm install`
3. Run `npm run dev`

## Environment Variables

- `DATABASE_URL` - Neon PostgreSQL connection string
- `AUTH_SECRET` - Random secret for auth (generate with `openssl rand -base64 32`)
- `GEMINI_API_KEY` - Google Gemini API key from aistudio.google.com
- `STRIPE_SECRET_KEY` - Stripe secret key (optional for launch)
- `NEXTAUTH_URL` - Your deployed app URL

## Deploy

Connect this repo to Vercel and add your environment variables in the Vercel dashboard.
