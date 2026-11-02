const asyncHandler = require("express-async-handler");
const Bill = require("../models/Bill");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const { predictUpcomingBills } = require("../services/aiService");

/**
 * @route GET /api/prediction/forecast?months=3
 * @access Private
 * Pulls the user's bill history and forwards it to the Python FastAPI
 * prediction engine, which returns a forecast + confidence + drivers.
 */
const getForecast = asyncHandler(async (req, res) => {
  const monthsAhead = Number(req.query.months) || 3;

  const bills = await Bill.find({ user: req.user._id })
    .sort({ createdAt: 1 })
    .select("billingMonth unitsConsumed billAmount createdAt");

  if (bills.length < 2) {
    throw new ApiError(
      400,
      "At least 2 historical bills are needed to generate a prediction — upload more bills first."
    );
  }

  const history = bills.map((b) => ({
    month: b.billingMonth || b.createdAt.toISOString().slice(0, 7),
    unitsConsumed: b.unitsConsumed || 0,
    billAmount: b.billAmount || 0,
  }));

  const forecast = await predictUpcomingBills(history, monthsAhead);

  return ApiResponse(res, 200, "Forecast generated", forecast);
});

module.exports = { getForecast };
