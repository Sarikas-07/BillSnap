from fastapi import APIRouter, HTTPException

from app.schemas import ForecastRequest, ForecastResponse
from app.services.prediction_engine import forecast

router = APIRouter(prefix="/api/prediction", tags=["Prediction"])


@router.post("/forecast", response_model=ForecastResponse)
async def forecast_bills(payload: ForecastRequest):
    """
    Takes the user's historical bills (month, units, amount) and returns a
    forecast for the next `monthsAhead` cycles with a confidence score and
    plain-language drivers explaining the forecast.

    Called by the Node backend's GET /api/prediction/forecast route.
    """
    if len(payload.history) < 2:
        raise HTTPException(status_code=400, detail="At least 2 historical bills are required")

    months_ahead = max(1, min(payload.monthsAhead, 6))

    try:
        predictions, confidence, trend_direction, drivers = forecast(payload.history, months_ahead)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return ForecastResponse(
        predictions=predictions,
        confidence=confidence,
        trendDirection=trend_direction,
        drivers=drivers,
    )
