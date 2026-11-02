# BillSnap — Requirements

Every dependency used across the three services, why it's there, and the
minimum tool versions needed to run the project.

## Tooling prerequisites

| Tool | Minimum version | Used by |
|---|---|---|
| Node.js | 18.x | frontend, backend |
| npm | 9.x | frontend, backend |
| Python | 3.10 | ai-service |
| pip | latest | ai-service |
| Tesseract OCR (system binary) | 4.x+ | ai-service (pytesseract shells out to it) |
| MongoDB Atlas account | — | backend |
| Cloudinary account | — | backend |

---

## Frontend (`frontend/`) — Next.js / TypeScript

| Package | Purpose |
|---|---|
| next | App Router framework |
| react, react-dom | UI runtime |
| typescript | Static typing |
| tailwindcss, @tailwindcss/postcss | Styling |
| framer-motion | Animations, transitions, gestures |
| recharts | Dashboard charts (bar, area, pie, composed) |
| three, @react-three/fiber, @react-three/drei | 3D hero scene on the landing page |
| lottie-react | Reserved for Lottie animation support |
| react-icons | Feather icon set used throughout the UI |
| lucide-react | Icon set (room icons, misc UI) |
| jspdf | Client-side certificate-style PDF report generation |
| clsx, tailwind-merge, class-variance-authority | Class-name composition for the UI primitives |
| @radix-ui/react-* | Unstyled accessible primitives (dialog, select, tabs, switch, tooltip, avatar, dropdown, checkbox, label, progress, separator) — wrapped as the app's own shadcn-style `components/ui/*` |
| eslint, eslint-config-next | Linting |

Install: `cd frontend && npm install`

---

## Backend (`backend/`) — Node.js / Express

| Package | Purpose |
|---|---|
| express | HTTP server/router |
| mongoose | MongoDB ODM (schemas, validation) |
| jsonwebtoken | JWT issuing/verification for auth |
| bcryptjs | Password hashing |
| cloudinary | Image hosting for bill photos + avatars |
| multer | Multipart file upload handling (memory storage) |
| streamifier | Streams multer's in-memory buffer to Cloudinary |
| axios, form-data | HTTP client to call the Python AI service (OCR + prediction) |
| cors | Cross-origin requests from the Next.js frontend |
| helmet | Security-related HTTP headers |
| morgan | Request logging |
| express-rate-limit | Basic brute-force throttling on auth routes |
| express-async-handler | Removes repetitive try/catch in async route handlers |
| validator | Email format validation |
| dotenv | Loads `.env` into `process.env` |
| nodemon (dev) | Auto-restart during development |

Install: `cd backend && npm install`

---

## AI Service (`ai-service/`) — Python / FastAPI

| Package | Purpose |
|---|---|
| fastapi | API framework |
| uvicorn[standard] | ASGI server |
| python-multipart | Required by FastAPI to parse uploaded files |
| pydantic, pydantic-settings | Request/response validation + env-based settings |
| pytesseract | Python wrapper around the Tesseract OCR engine |
| Pillow | Image loading/manipulation |
| opencv-python-headless | Image preprocessing (grayscale, denoise, adaptive threshold) before OCR |
| numpy | Array operations for image processing and forecasting |
| scikit-learn | Linear regression for the bill prediction engine |
| python-dotenv | Loads `.env` into the process environment |

Install:
```bash
cd ai-service
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

System dependency (not pip-installable): the **tesseract-ocr** binary itself.
- macOS: `brew install tesseract`
- Ubuntu/Debian: `sudo apt install tesseract-ocr`
- Windows: https://github.com/UB-Mannheim/tesseract/wiki

---

## Third-party accounts needed

| Service | Free tier? | Used for |
|---|---|---|
| MongoDB Atlas | Yes (M0) | Primary database |
| Cloudinary | Yes | Bill image + avatar storage |
| Vercel | Yes | Frontend hosting |
| Render | Yes (Starter, may sleep when idle) | Backend + AI service hosting |

See `docs/mongodb-atlas-setup.md` for the Atlas walkthrough.
