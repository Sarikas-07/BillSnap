# BillSnap Backend (Stage 2)

Node.js/Express/MongoDB API that powers the Stage 1 Next.js frontend.
Handles auth, profiles, rooms, appliances, bills, analytics, risk analysis,
and SnapBot chat — and delegates OCR + bill prediction to the Python
FastAPI AI service (`billsnap-ai/`).

## Folders

```
billsnap-backend/
├─ server.js              Entry point: loads env, connects Mongo, starts Express
├─ src/
│  ├─ app.js               Express app: middleware, route mounting, error handler
│  ├─ config/
│  │  ├─ db.js               Mongoose/MongoDB Atlas connection
│  │  └─ cloudinary.js       Cloudinary SDK configuration
│  ├─ models/               Mongoose schemas
│  │  ├─ User.js              bcrypt password hashing, profile fields
│  │  ├─ Room.js
│  │  ├─ Appliance.js         auto-computes daily/monthly kWh on save
│  │  ├─ Bill.js              OCR-extracted + manual bill records
│  │  └─ ChatMessage.js       SnapBot chat history, grouped by sessionId
│  ├─ middleware/
│  │  ├─ authMiddleware.js    JWT verification, attaches req.user
│  │  ├─ errorMiddleware.js   404 handler + centralised error formatter
│  │  └─ uploadMiddleware.js  multer memory-storage file filter (images/PDF)
│  ├─ controllers/          Route handlers — one file per resource
│  │  ├─ authController.js       signup, login, getMe, logout
│  │  ├─ userController.js       profile get/update, change password, avatar
│  │  ├─ roomController.js       Room CRUD
│  │  ├─ applianceController.js  Appliance CRUD + toggle
│  │  ├─ billController.js       upload+OCR, manual entry, bill CRUD
│  │  ├─ analyticsController.js  dashboard summary, room usage, trend, tips
│  │  ├─ predictionController.js proxies bill history to FastAPI forecast
│  │  ├─ riskController.js       runs the rule-based risk engine
│  │  └─ snapbotController.js    chat message handling + history
│  ├─ routes/                Express routers, one per resource, all under /api
│  ├─ services/              Business logic reused across controllers
│  │  ├─ cloudinaryService.js   buffer → Cloudinary upload/delete
│  │  ├─ aiService.js           HTTP client for the FastAPI AI service
│  │  ├─ riskService.js         rule-based circuit/ageing/phantom-load checks
│  │  ├─ savingsService.js      rule-based savings tip generator
│  │  └─ snapbotService.js      intent matching + answers using live user data
│  └─ utils/
│     ├─ generateToken.js     JWT signing
│     ├─ ApiError.js          typed error with an HTTP status code
│     └─ ApiResponse.js       consistent { success, message, data } shape
├─ package.json
├─ .env.example
```

## Prerequisites

- Node.js 18+
- A MongoDB Atlas cluster (free tier is fine) — https://www.mongodb.com/cloud/atlas
- A Cloudinary account (free tier is fine) — https://cloudinary.com
- The `billsnap-ai` FastAPI service running (for bill upload OCR and prediction)

## Setup

```bash
cd billsnap-backend
npm install
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, CLOUDINARY_* etc.
```

## Run

```bash
npm run dev     # nodemon, auto-restart on file changes
# or
npm start        # plain node
```

Server starts on http://localhost:5000 (or `PORT` from `.env`).
Health check: `GET /health`

## API overview

All routes are prefixed with `/api`. Every route except `/auth/signup` and
`/auth/login` requires `Authorization: Bearer <token>`.

| Resource | Routes |
|---|---|
| Auth | `POST /auth/signup`, `POST /auth/login`, `GET /auth/me`, `POST /auth/logout` |
| Users | `GET/PUT /users/profile`, `PUT /users/password`, `PUT /users/avatar` |
| Rooms | `GET/POST /rooms`, `PUT/DELETE /rooms/:id` |
| Appliances | `GET/POST /appliances`, `GET/PUT/DELETE /appliances/:id`, `PATCH /appliances/:id/toggle` |
| Bills | `POST /bills/upload` (OCR), `GET/POST /bills`, `GET /bills/latest`, `GET/PUT/DELETE /bills/:id` |
| Analytics | `GET /analytics/summary`, `GET /analytics/room-usage`, `GET /analytics/consumption-trend`, `GET /analytics/savings-tips` |
| Prediction | `GET /prediction/forecast?months=3` |
| Risk | `GET /risk/analyze` |
| SnapBot | `POST /snapbot/message`, `GET /snapbot/history`, `GET /snapbot/sessions`, `DELETE /snapbot/history/:sessionId` |

## Design notes

- **Password security**: bcrypt hashing happens in a Mongoose pre-save hook
  on `User` — controllers never hash passwords themselves, so it can't be
  accidentally skipped.
- **Bill upload flow**: the uploaded image is sent to Cloudinary *and* the
  FastAPI OCR endpoint in parallel (`Promise.all`), then the extracted
  fields + Cloudinary URL are saved as one `Bill` document.
- **Risk analysis and savings tips are rule-based and run entirely in
  Node** — no AI call needed, since they're deterministic checks against
  the user's own appliance data (circuit wattage sums, appliance age,
  known phantom-load device types).
- **SnapBot** is also rule-based (regex intent matching) and answers using
  the user's real data — e.g. "which appliance uses the most power?" runs
  a live Mongo query rather than returning a canned string. Every message
  (from both user and bot) is persisted to `ChatMessage`, grouped by
  `sessionId`, so history survives reloads. Swap `snapbotService.js` for
  an LLM call later without touching the controller or routes.
- **OCR and prediction are the only two things that go to Python** — the
  true "AI" pieces (computer vision, regression) — everything else is
  ordinary CRUD/business logic in Node.
