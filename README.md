# BillSnap

**Bringing transparency to electricity costs.**

BillSnap is a full-stack app that turns your electricity bill into
room-by-room, appliance-by-appliance clarity — with OCR bill scanning,
usage prediction, risk analysis, and an in-app assistant (SnapBot).

This repository contains all three build stages as one monorepo:

```
billsnap-project/
├─ frontend/      Stage 1 — Next.js/TypeScript UI (12 pages, SnapBot widget, charts)
├─ backend/       Stage 2 — Node/Express/MongoDB API (auth, CRUD, risk, analytics)
├─ ai-service/    Stage 2 — Python FastAPI (OCR + bill prediction)
├─ docs/
│  └─ mongodb-atlas-setup.md
├─ render.yaml    Render Blueprint — deploys backend + ai-service together
├─ requirements.md   Every dependency across all three services
└─ README.md      You are here
```

## Architecture

```
┌──────────────┐      HTTPS       ┌──────────────┐     HTTP (internal)   ┌──────────────┐
│  frontend     │ ───────────────▶│  backend      │──────────────────────▶│  ai-service   │
│  Next.js      │◀─────────────── │  Node/Express │◀───────────────────── │  FastAPI      │
│  (Vercel)     │      JSON        │  (Render)     │      JSON              │  (Render)     │
└──────────────┘                  └──────┬───────┘                        └──────────────┘
                                          │
                                          ▼
                                   ┌─────────────┐      ┌─────────────┐
                                   │ MongoDB     │      │ Cloudinary  │
                                   │ Atlas       │      │ (images)    │
                                   └─────────────┘      └─────────────┘
```

- **frontend** never talks to `ai-service` directly — everything goes
  through `backend`, which is the only public API surface besides the
  frontend itself.
- **ai-service** does the two genuinely "AI" jobs: computer-vision OCR on
  bill photos, and bill forecasting via linear regression. Everything else
  (auth, CRUD, risk rules, SnapBot's replies) is ordinary business logic in
  `backend`.

## Feature summary by stage

**Stage 1 — Frontend**
Landing, Login, Signup, Dashboard Home, Room Dashboard, Appliance
Management, Analysis Dashboard, Prediction Dashboard, Bill Upload UI, Risk
Analysis UI, Report UI, Settings, Profile. Animated sidebar, glassmorphism
cards, SnapBot floating widget, Framer Motion throughout, Recharts-powered
graphs, a React Three Fiber 3D hero.

**Stage 2 — Backend + AI**
JWT auth with bcrypt password hashing, MongoDB Atlas via Mongoose, full
Room/Appliance CRUD, Bill Upload with computer-vision OCR (customer number,
billing month, units consumed, bill amount, due date, status), Cloudinary
image storage, a linear-regression prediction engine, a rule-based risk
engine, savings tips, and a SnapBot backend with persistent chat history.

**Stage 3 — Polish & Deployment**
Certificate-style downloadable/printable PDF reports (BillSnap logo,
tagline, developer credit), a "Try Demo" modal (real video or animated
fallback tour), a custom toast notification system, loading skeletons,
error boundaries, a styled 404 page, performance tuning, and deployment
configs for Vercel, Render, and MongoDB Atlas.

## Quick start (all three services locally)

```bash
# 1) AI service
cd ai-service
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000

# 2) Backend — new terminal
cd backend
npm install
cp .env.example .env     # fill in MONGO_URI, JWT_SECRET, CLOUDINARY_*
npm run dev

# 3) Frontend — new terminal
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:3000. The frontend currently renders from its own
built-in demo data (`frontend/src/lib/demo-data.ts`) — wiring its pages to
the live `backend` API is the natural next stage.

## Deploying

1. **MongoDB Atlas** — follow `docs/mongodb-atlas-setup.md` to get a
   `MONGO_URI`.
2. **Cloudinary** — create a free account at cloudinary.com, grab your
   cloud name/API key/secret from the dashboard.
3. **Backend + AI service (Render)** — push this repo to GitHub, then in
   Render choose **New +** → **Blueprint**, point it at the repo. Render
   reads `render.yaml` and provisions both `billsnap-backend` and
   `billsnap-ai`. Fill in the `sync: false` env vars (Mongo URI, Cloudinary
   keys, allowed origins) in the Render dashboard after provisioning.
4. **Frontend (Vercel)** — import the repo in Vercel, set the project root
   to `frontend/`, and Vercel will pick up `frontend/vercel.json`
   automatically. Set `NEXT_PUBLIC_API_URL` to your deployed backend's URL
   in the Vercel dashboard's Environment Variables.

## Documentation index

- `frontend/README.md` — frontend structure, pages, design system
- `backend/README.md` — backend structure, full route table, design notes
- `ai-service/README.md` — AI service structure, OCR/prediction endpoints
- `docs/mongodb-atlas-setup.md` — step-by-step Atlas cluster setup
- `requirements.md` — every dependency across all three services, with
  what it's for

## License

This project was built as a learning/portfolio full-stack case study
(BillSnap). Use, fork, and adapt it freely.
