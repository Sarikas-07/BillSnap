# BillSnap — Stage 1 (Frontend Only)

Bringing transparency to electricity costs. This is the Stage 1 frontend-only build:
Next.js App Router + TypeScript + Tailwind CSS + ShadCN-style UI + Framer Motion +
Recharts + React Three Fiber + Lottie. No backend — all data is local demo data in
`src/lib/demo-data.ts`.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000

`npm run build && npm run start` builds and serves the production build.

## Pages

- `/` — Landing page
- `/login`, `/signup` — Auth
- `/dashboard` — Dashboard Home
- `/dashboard/rooms` — Room Dashboard
- `/dashboard/appliances` — Appliance Management
- `/dashboard/analysis` — Analysis Dashboard
- `/dashboard/prediction` — Prediction Dashboard
- `/dashboard/bill-upload` — Bill Upload UI
- `/dashboard/risk` — Risk Analysis UI
- `/dashboard/reports` — Report UI
- `/dashboard/settings` — Settings
- `/dashboard/profile` — Profile

SnapBot (floating chat icon, bottom-right) appears on every page — UI only, no AI wired up yet.

## Notes

- Fonts (Inter, Space Grotesk, JetBrains Mono) load via `next/font/google` — needs
  internet on first `dev`/`build` to fetch them (standard Next.js behavior).
- All data is mocked in `src/lib/demo-data.ts` — swap for real API calls in Stage 2.
- No backend, no database, no auth logic — forms are non-functional by design.
