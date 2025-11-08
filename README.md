# Productivity Hub (Frontend)

A modular productivity app bringing tasks, notes, habits, calendar, bookmarks, and universal search into one workspace. This repository contains the React + TypeScript frontend powered by Vite.

## Key Features (MVP scope)

- Tasks: list/Kanban views, priorities, labels, due dates, keyboard-friendly edits
- Notes: rich text with Markdown shortcuts (TipTap-ready), tags, attachments (future)
- Habits & Focus: Pomodoro sessions and streaks (planned)
- Calendar: due-date calendar view, ICS import/export (planned)
- Bookmarks/Reading list: save URLs, read-later queue (planned)
- Universal Search: instant search with filters; Atlas Search integration (planned)
- Polished UX: dark/light theme, a11y (WCAG AA), responsive layout

## Tech Stack

- React 19 + TypeScript
- Vite 7 for dev/build
- State: TanStack Query (server state), lightweight local state (Zustand optional)
- Testing: Vitest + Testing Library
- Lint/Format: ESLint 9, Prettier 3
- Styling: Tailwind CSS (optional; not yet added)
- PWA (planned): Service worker + IndexedDB for offline cache

## Getting Started

Prerequisites: Node 18+ and npm (or pnpm/yarn)

Install dependencies:

```powershell
npm install
```

Run in development:

```powershell
npm run dev
```

Type-check, lint, and build:

```powershell
# Type-check only
npx tsc -b

# Lint
npm run lint

# Production build
npm run build

# Preview build
npm run preview
```

## Scripts

- `npm run dev` — start Vite dev server
- `npm run test` — run unit tests with Vitest
- `npm run lint` — run ESLint
- `npm run lint:fix` — auto-fix lint issues
- `npm run build` — type-check and build for production
- `npm run preview` — preview built app

## Quality Gates

- Build: PASS when `npm run build` succeeds
- Lint/Typecheck: PASS when ESLint reports no errors and `npx tsc -b` has no errors
- Tests: PASS when `npm run test` is green

## Roadmap (high level)

1. Core tasks + notes CRUD, Kanban view, basic search
2. Rich text editor (TipTap), file uploads
3. Universal search (Atlas Search), tags/filters, CSV import/export
4. Real-time presence/comments, activity feed, notifications
5. PWA offline mode, theming, accessibility polish
6. Integrations (Google Calendar), Stripe subscriptions
7. AI features (summaries, semantic search)

## License

MIT
