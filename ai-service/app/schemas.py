from datetime import date
from typing import List, Optional

from pydantic import BaseModel, Field


# ---------- OCR ----------

class BillSlab(BaseModel):
    slab: str
    range: str
    units: float = 0
    rate: float = 0
    amount: float = 0


class BillExtraction(BaseModel):
    customerNumber: Optional[str] = None
    billingMonth: Optional[str] = None
    unitsConsumed: Optional[float] = None
    billAmount: Optional[float] = None
    dueDate: Optional[str] = None  # ISO date string, parsed by Node/Mongoose
    status: str = "Unknown"
    slabs: List[BillSlab] = Field(default_factory=list)
    fixedCharge: float = 0
    taxesFees: float = 0
    carbonFootprintKg: float = 0
    confidence: float = 0.0
    rawText: str = ""


# ---------- Prediction ----------

class HistoryPoint(BaseModel):
    month: str
    unitsConsumed: float = 0
    billAmount: float = 0


class ForecastRequest(BaseModel):
    history: List[HistoryPoint]
    monthsAhead: int = 3


class PredictionPoint(BaseModel):
    month: str
    predictedUnits: float
    predictedBillAmount: float


class ForecastResponse(BaseModel):
    predictions: List[PredictionPoint]
    confidence: float
    trendDirection: str  # "up" | "down" | "flat"
    drivers: List[str]
