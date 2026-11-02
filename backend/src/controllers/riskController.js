const asyncHandler = require("express-async-handler");
const Appliance = require("../models/Appliance");
const ApiResponse = require("../utils/ApiResponse");
const { analyzeRisk } = require("../services/riskService");

/**
 * @route GET /api/risk/analyze
 * @access Private
 * Runs the rule-based risk engine over the user's current appliances.
 */
const getRiskAnalysis = asyncHandler(async (req, res) => {
  const appliances = await Appliance.find({ user: req.user._id }).populate("room", "name");
  const { riskScore, factors } = analyzeRisk(appliances);

  return ApiResponse(res, 200, "Risk analysis complete", {
    riskScore,
    factors,
    summary: {
      high: factors.filter((f) => f.severity === "High").length,
      medium: factors.filter((f) => f.severity === "Medium").length,
      low: factors.filter((f) => f.severity === "Low").length,
    },
  });
});

module.exports = { getRiskAnalysis };
