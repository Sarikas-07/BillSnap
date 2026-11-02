from fastapi import APIRouter, File, HTTPException, UploadFile

from app.schemas import BillExtraction
from app.services.ocr_engine import extract_bill_fields

router = APIRouter(prefix="/api/ocr", tags=["OCR"])

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}


@router.post("/extract", response_model=BillExtraction)
async def extract_bill(file: UploadFile = File(...)):
    """
    Accepts a bill image (JPG/PNG/WEBP) and returns structured fields:
    customer number, billing month, units consumed, bill amount, due date,
    and payment status — plus a rough confidence score and the raw OCR text.

    Called by the Node backend's POST /api/bills/upload route.
    """
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported content type '{file.content_type}'. Upload a JPG, PNG, or WEBP image.",
        )

    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    try:
        result = extract_bill_fields(image_bytes)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=422, detail=f"Could not process image: {exc}") from exc

    return result
