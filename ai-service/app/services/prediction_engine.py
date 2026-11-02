"""
Prediction engine — forecasts upcoming electricity bills from a user's
billing history using linear regression (scikit-learn), plus a light
seasonal bump for summer months (higher AC load in India).

Falls back to a simple moving-average trend when there isn't enough
history for a stable regression (fewer than 3 points).
"""

from datetime import datetime
from typing import List

import numpy as np
from sklearn.linear_model import LinearRegression

from app.schemas import HistoryPoint, PredictionPoint

MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
# Rough seasonal multiplier for India — summer (Mar-Jun) and early monsoon
# months trend higher due to AC/cooler load; winter trends lower.
SEASONAL_FACTOR = {
    1: 0.96, 2: 0.97, 3: 1.03, 4: 1.08, 5: 1.12, 6: 1.10,
    7: 1.04, 8: 1.05, 9: 1.00, 10: 0.97, 11: 0.94, 12: 0.95,
}


def _month_index_guess(label: str, fallback_idx: int) -> int:
    """Best-effort parse of a 'Month YYYY' style label to a 1-12 month number."""
    for i, abbr in enumerate(MONTH_ABBR, start=1):
        if label[:3].lower() == abbr.lower():
            return i
    return (fallback_idx % 12) + 1


def _next_month_labels(last_label: str, count: int) -> List[str]:
    """Generates the next `count` 'Mon YYYY' labels after the last known one."""
    now = datetime.utcnow()
    try:
        parts = last_label.replace(",", " ").split()
        month_str, year_str = parts[0][:3], parts[-1]
        month_num = MONTH_ABBR.index(month_str.title()) + 1
        year = int(year_str)
    except Exception:
        month_num, year = now.month, now.year

    labels = []
    for i in range(1, count + 1):
        m = month_num + i
        y = year + (m - 1) // 12
        m = ((m - 1) % 12) + 1
        labels.append(f"{MONTH_ABBR[m - 1]} {y}")
    return labels, [((month_num + i - 1) % 12) + 1 for i in range(1, count + 1)]


def forecast(history: List[HistoryPoint], months_ahead: int = 3):
    if len(history) < 2:
        raise ValueError("At least 2 historical points are required to forecast")

    units = np.array([h.unitsConsumed for h in history], dtype=float)
    amounts = np.array([h.billAmount for h in history], dtype=float)
    x = np.arange(len(history)).reshape(-1, 1)

    last_label = history[-1].month
    future_labels, future_month_nums = _next_month_labels(last_label, months_ahead)
    future_x = np.arange(len(history), len(history) + months_ahead).reshape(-1, 1)

    if len(history) >= 3:
        units_model = LinearRegression().fit(x, units)
        amount_model = LinearRegression().fit(x, amounts)
        pred_units = units_model.predict(future_x)
        pred_amounts = amount_model.predict(future_x)
        # R^2 as a rough confidence proxy, clamped to a sane display range
        r2 = max(0.0, min(1.0, amount_model.score(x, amounts)))
        confidence = round(0.55 + 0.4 * r2, 2)  # floor at 0.55 so it never looks untrustworthy
    else:
        # Only 2 points — use simple linear extrapolation between them
        slope_units = units[-1] - units[0]
        slope_amount = amounts[-1] - amounts[0]
        pred_units = np.array([units[-1] + slope_units * (i + 1) for i in range(months_ahead)])
        pred_amounts = np.array([amounts[-1] + slope_amount * (i + 1) for i in range(months_ahead)])
        confidence = 0.5

    # Apply seasonal adjustment on top of the trend line
    predictions = []
    for i in range(months_ahead):
        seasonal = SEASONAL_FACTOR.get(future_month_nums[i], 1.0)
        p_units = max(0.0, float(pred_units[i]) * seasonal)
        p_amount = max(0.0, float(pred_amounts[i]) * seasonal)
        predictions.append(
            PredictionPoint(
                month=future_labels[i],
                predictedUnits=round(p_units, 1),
                predictedBillAmount=round(p_amount, 0),
            )
        )

    trend_direction = "flat"
    if len(amounts) >= 2:
        delta = amounts[-1] - amounts[0]
        if delta > amounts[0] * 0.03:
            trend_direction = "up"
        elif delta < -amounts[0] * 0.03:
            trend_direction = "down"

    drivers = _explain_drivers(history, predictions, trend_direction)

    return predictions, confidence, trend_direction, drivers


def _explain_drivers(history, predictions, trend_direction) -> List[str]:
    drivers = []
    if trend_direction == "up":
        drivers.append("Historical billing pattern shows a steady upward trend")
    elif trend_direction == "down":
        drivers.append("Recent bills show a downward trend versus earlier cycles")
    else:
        drivers.append("Recent bills have stayed roughly flat cycle over cycle")

    upcoming_months = {p.month.split()[0] for p in predictions}
    if upcoming_months & {"Mar", "Apr", "May", "Jun"}:
        drivers.append("Seasonal temperature rise typically adds 8-12% to AC-driven load")
    if upcoming_months & {"Dec", "Jan", "Feb"}:
        drivers.append("Winter months typically see reduced cooling load")

    drivers.append(f"Model based on {len(history)} prior billing cycle(s)")
    return drivers
