from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import ocr, prediction

settings = get_settings()

app = FastAPI(
    title="BillSnap AI Service",
    description="Computer vision OCR and bill prediction engine for BillSnap.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ocr.router)
app.include_router(prediction.router)


@app.get("/", tags=["Health"])
def root():
    return {"service": "billsnap-ai", "status": "ok"}


@app.get("/health", tags=["Health"])
def health():
    return {"success": True, "message": "BillSnap AI service is running"}
