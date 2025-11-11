# Agent Guidelines for pplx

## Commands
- **Build**: `pnpm build` (Next.js with Turbopack)
- **Dev**: `pnpm dev` (Next.js with Turbopack)
- **Lint**: `pnpm lint` (ESLint with Next.js config)
- **Typecheck**: `pnpm typecheck` (TypeScript strict mode)
- **Check**: `pnpm check` (lint + typecheck)
- **DB**: `pnpm db:migrate`, `pnpm db:generate`, `pnpm db:push`

## Code Style
- **Language**: TypeScript with strict mode enabled
- **Framework**: Next.js 15 with App Router
- **Imports**: React → third-party → local (@/ prefix)
- **Naming**: camelCase (functions/vars), PascalCase (components)
- **Types**: Strong typing required, use interfaces for objects
- **Error Handling**: Try-catch blocks, console.error for logging
- **Validation**: Use Zod schemas for API inputs
- **Styling**: Tailwind CSS with clsx/cn utility
- **Formatting**: Follow ESLint rules, no extra semicolons
- **Components**: Functional components with TypeScript props