"""
OCR engine for electricity bill images/PDIs.

Pipeline: bytes -> PIL image -> OpenCV preprocessing (grayscale, denoise,
adaptive threshold) -> pytesseract text extraction -> regex field parsing.

This is intentionally regex/heuristic based rather than a trained model —
Indian DISCOM bill layouts vary a lot, and labelled regex patterns are far
more reliable than a small trained model would be without a large labelled
dataset. Swap `extract_bill_fields` for a fine-tuned model later without
touching the router or the Node client.
"""

import io
import re
from datetime import datetime
from typing import Optional

import numpy as np
import pytesseract
from PIL import Image

from app.config import get_settings

settings = get_settings()
if settings.tesseract_cmd:
    pytesseract.pytesseract.tesseract_cmd = settings.tesseract_cmd


def _preprocess(image_bytes: bytes) -> Image.Image:
    """Grayscale + adaptive threshold to make text pop for tesseract."""
    import cv2

    pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    cv_img = np.array(pil_img)[:, :, ::-1]  # RGB -> BGR

    gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
    denoised = cv2.fastNlMeansDenoising(gray, h=15)
    thresh = cv2.adaptiveThreshold(
        denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 31, 11
    )
    return Image.fromarray(thresh)


def _run_ocr(image_bytes: bytes) -> str:
    try:
        processed = _preprocess(image_bytes)
        text = pytesseract.image_to_string(processed)
        if len(text.strip()) < 20:
            # Preprocessing sometimes hurts low-contrast scans — fall back to raw image.
            raw = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            text = pytesseract.image_to_string(raw)
        return text
    except Exception:
        # Last-resort fallback straight on the original bytes
        raw = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        return pytesseract.image_to_string(raw)


# --- Field-specific regex patterns (tolerant of common label variants) ---

CUSTOMER_NO_PATTERNS = [
    r"(?:customer|consumer|account)\s*(?:no\.?|number|id)\s*[:\-]?\s*([A-Z0-9\-\/]{4,20})",
    r"\bCA\s*(?:no\.?|number)?\s*[:\-]?\s*([A-Z0-9\-\/]{4,20})",
]

BILLING_MONTH_PATTERNS = [
    r"(?:bill(?:ing)?\s*(?:month|period|cycle))\s*[:\-]?\s*([A-Za-z]{3,9}\s*[\-\/]?\s*\d{4})",
    r"\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+(\d{4})\b",
]

UNITS_PATTERNS = [
    r"(?:total\s*)?units?\s*consumed\s*[:\-]?\s*([\d,]+(?:\.\d+)?)",
    r"\bunits?\s*[:\-]?\s*([\d,]+(?:\.\d+)?)\s*kwh",
]

AMOUNT_PATTERNS = [
    r"(?:total\s*(?:bill\s*)?amount|net\s*payable|amount\s*payable|total\s*due)\s*[:\-]?\s*(?:rs\.?|inr|₹)?\s*([\d,]+(?:\.\d{1,2})?)",
]

DUE_DATE_PATTERNS = [
    r"(?:due\s*date|payment\s*due\s*(?:date|by))\s*[:\-]?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4})",
]

STATUS_KEYWORDS = [
    ("overdue", "Overdue"),
    ("unpaid", "Unpaid"),
    ("paid", "Paid"),
    ("good", "Good"),
]

MONTH_MAP = {
    "jan": 1, "feb": 2, "mar": 3, "apr": 4, "may": 5, "jun": 6,
    "jul": 7, "aug": 8, "sep": 9, "sept": 9, "oct": 10, "nov": 11, "dec": 12,
}


def _first_match(patterns, text: str) -> Optional[str]:
    for pattern in patterns:
        m = re.search(pattern, text, re.IGNORECASE)
        if m:
            return m.group(1).strip()
    return None


def _parse_due_date(raw: Optional[str]) -> Optional[str]:
    if not raw:
        return None
    raw = raw.strip()
    for fmt in ("%d/%m/%Y", "%d-%m-%Y", "%d.%m.%Y", "%d/%m/%y", "%d %B %Y", "%d %b %Y"):
        try:
            return datetime.strptime(raw, fmt).date().isoformat()
        except ValueError:
            continue
    return None


def _detect_status(text: str) -> str:
    lowered = text.lower()
    for keyword, label in STATUS_KEYWORDS:
        if keyword in lowered:
            return label
    return "Unknown"


def extract_bill_fields(image_bytes: bytes) -> dict:
    text = _run_ocr(image_bytes)

    customer_number = _first_match(CUSTOMER_NO_PATTERNS, text)

    billing_month_raw = _first_match(BILLING_MONTH_PATTERNS, text)
    billing_month = billing_month_raw.title() if billing_month_raw else None

    units_raw = _first_match(UNITS_PATTERNS, text)
    units_consumed = float(units_raw.replace(",", "")) if units_raw else None

    amount_raw = _first_match(AMOUNT_PATTERNS, text)
    bill_amount = float(amount_raw.replace(",", "")) if amount_raw else None

    due_date_raw = _first_match(DUE_DATE_PATTERNS, text)
    due_date = _parse_due_date(due_date_raw)

    status = _detect_status(text)

    fields_found = sum(
        1 for v in [customer_number, billing_month, units_consumed, bill_amount, due_date] if v
    )
    confidence = round(fields_found / 5, 2)

    # Rough carbon footprint estimate: ~0.72 kg CO2 per kWh (Indian grid avg)
    carbon_footprint_kg = round(units_consumed * 0.72, 1) if units_consumed else 0

    return {
        "customerNumber": customer_number,
        "billingMonth": billing_month,
        "unitsConsumed": units_consumed,
        "billAmount": bill_amount,
        "dueDate": due_date,
        "status": status,
        "slabs": [],
        "fixedCharge": 0,
        "taxesFees": 0,
        "carbonFootprintKg": carbon_footprint_kg,
        "confidence": confidence,
        "rawText": text[:4000],  # cap stored raw text
    }
