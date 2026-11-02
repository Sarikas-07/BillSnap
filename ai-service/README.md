# BillSnap AI Service (Stage 2)

Python FastAPI microservice providing the two genuinely "AI" pieces of
BillSnap: computer-vision OCR on bill images, and a bill forecasting engine.
Everything else (auth, CRUD, risk rules, SnapBot) lives in the Node backend
and calls into this service over HTTP.

## Folders

```
billsnap-ai/
├─ app/
│  ├─ main.py            FastAPI app, CORS, router registration, /health
│  ├─ config.py           Settings loaded from .env (pydantic-settings)
│  ├─ schemas.py          Pydantic request/response models
│  ├─ routers/
│  │  ├─ ocr.py            POST /api/ocr/extract
│  │  └─ prediction.py     POST /api/prediction/forecast
│  └─ services/
│     ├─ ocr_engine.py      OpenCV preprocessing + pytesseract + regex field parsing
│     └─ prediction_engine.py  scikit-learn linear regression + seasonal adjustment
├─ requirements.txt
├─ .env.example
```

## Prerequisites

- Python 3.10+
- **Tesseract OCR** installed on the system (the `pytesseract` package is
  just a wrapper — it shells out to the real `tesseract` binary):
  - macOS: `brew install tesseract`
  - Ubuntu/Debian: `sudo apt install tesseract-ocr`
  - Windows: install from https://github.com/UB-Mannheim/tesseract/wiki, then
    set `TESSERACT_CMD` in `.env` to the full path of `tesseract.exe`

## Setup

```bash
cd billsnap-ai
python -m venv .venv
# macOS/Linux:
source .venv/bin/activate
# Windows:
.venv\Scripts\activate

pip install -r requirements.txt
cp .env.example .env   # then fill in values if needed
```

## Run

```bash
uvicorn app.main:app --reload --port 8000
```

Interactive API docs: http://localhost:8000/docs

## Endpoints

- `POST /api/ocr/extract` — multipart form, field `file` (JPG/PNG/WEBP) →
  `{ customerNumber, billingMonth, unitsConsumed, billAmount, dueDate, status, confidence, rawText, ... }`
- `POST /api/prediction/forecast` — JSON body `{ history: [{month, unitsConsumed, billAmount}], monthsAhead }` →
  `{ predictions: [...], confidence, trendDirection, drivers: [...] }`
- `GET /health` — liveness check

## Notes

- OCR uses regex/heuristic field extraction tuned for common Indian DISCOM
  bill layouts, not a trained model — this is deliberate: bill layouts vary
  a lot between providers, and labelled regex is far more reliable than a
  small model would be without a large labelled training set. Swap
  `extract_bill_fields()` for a fine-tuned model later without touching the
  router or the Node client.
- Prediction uses linear regression over billing history with a seasonal
  multiplier for Indian summer/winter AC load patterns, falling back to
  simple linear extrapolation when fewer than 3 data points exist.
- This service is internal-only — it's called by the Node backend, never
  directly by the frontend. Keep it off the public internet in production
  (e.g., same private network/VPC as the Node service) or protect it with
  `AI_SERVICE_API_KEY`.
