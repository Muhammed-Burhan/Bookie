# Bookie — AI-Powered Book Rating Platform

Frontend for **Bookie**, a book rating and recommendation platform built for SE507. Users conduct AI-driven interviews to rate books and receive personalized reading suggestions.

## Tech Stack

- **Next.js 16** (App Router) — React 19, TypeScript
- **Tailwind CSS v4**
- **Zustand** — auth state with persistence
- **Axios** — API client with auto token injection and 401 handling
- **Framer Motion** — page transitions and animations
- **React Hook Form + Zod** — form validation
- **Lucide React** — icons

## Getting Started

Make sure the backend API is running at `http://localhost:8000`.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/                  # Next.js App Router pages
  auth/               # Login & Register
  books/[id]/         # Book detail
  feed/               # Community opinions feed
  search/             # Browse & search books
  rating/interview/   # AI rating interview
  admin/dashboard/    # Admin panel (admin role only)
components/
  layout/             # Navbar, Footer, ClientLayout
  auth/               # AuthLayout
  books/              # BookCard
  feed/               # OpinionCard
  home/               # Hero, Trending
  rating/             # RatingInterview
lib/
  api/client.ts       # Axios instance with interceptors
  store/auth.ts       # Zustand auth store
  types.ts            # Shared TypeScript types
  utils.ts            # cn, formatScore, getRatingColorTheme
```

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Scripts

```bash
npm run dev      # Development server (Turbopack)
npm run build    # Production build
npm run lint     # ESLint
```
