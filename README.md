PPLX Chat — Next.js app with AI chat models (OpenRouter, Groq, Google, Perplexity).

## Quick start

```bash
pnpm install
cp .env.example .env.local # then fill keys
pnpm dev
```

Open http://localhost:3000.

## Environment

Set the following in `.env.local`:

```bash
OPENROUTER_API_KEY=...
GROQ_API_KEY=...
GOOGLE_GENERATIVE_AI_API_KEY=...
PERPLEXITY_API_KEY=...
```

Only the providers you use need keys.

## Scripts

```bash
pnpm dev       # start dev server (Turbopack)
pnpm build     # production build (Turbopack)
pnpm start     # start production server
pnpm lint      # run eslint
pnpm typecheck # run typescript checks
pnpm check     # lint + typecheck
```

## Notes

- Theme toggles follow system preference by default and work without flashes.
- Metadata and social tags are configured in `app/layout.tsx`.

## Starting docker mcp server

```bash
docker mcp gateway run --port=8811 --transport=sse
```
