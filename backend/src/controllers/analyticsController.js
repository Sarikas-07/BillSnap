const asyncHandler = require("express-async-handler");
const Appliance = require("../models/Appliance");
const Room = require("../models/Room");
const Bill = require("../models/Bill");
const ApiResponse = require("../utils/ApiResponse");
const { generateSavingsTips } = require("../services/savingsService");

/**
 * @route GET /api/analytics/summary
 * @access Private
 * Powers the Dashboard Home KPI cards.
 */
const getSummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const appliances = await Appliance.find({ user: userId });
  const activeApp = appliances.filter((a) => a.status);

  const currentLoadKw = Number(
    (activeApp.reduce((s, a) => s + a.powerRatingWatts * a.quantity, 0) / 1000).toFixed(2)
  );
  const monthlyUsageKwh = Number(appliances.reduce((s, a) => s + a.monthlyUsageKwh, 0).toFixed(2));

  const latestBill = await Bill.findOne({ user: userId }).sort({ createdAt: -1 });
  const prevBill = await Bill.findOne({ user: userId }).sort({ createdAt: -1 }).skip(1);

  const billTrend = prevBill && latestBill
    ? Number((((latestBill.billAmount - prevBill.billAmount) / prevBill.billAmount) * 100).toFixed(1))
    : 0;

  // System health: a simple heuristic — 100 minus % of appliances that are "ageing"
  const ageingCount = appliances.filter(
    (a) => a.installedYear && new Date().getFullYear() - a.installedYear >= 5
  ).length;
  const systemHealth = appliances.length
    ? Number((100 - (ageingCount / appliances.length) * 15).toFixed(1))
    : 100;

  return ApiResponse(res, 200, "Summary fetched", {
    currentLoad: { value: currentLoadKw, unit: "kW" },
    systemHealth: { value: systemHealth, unit: "%" },
    monthlyUsage: { value: monthlyUsageKwh, unit: "kWh" },
    estimatedBill: {
      value: latestBill?.billAmount ?? 0,
      unit: "₹",
      trend: billTrend,
    },
    roomCount: await Room.countDocuments({ user: userId }),
    applianceCount: appliances.length,
  });
});

/**
 * @route GET /api/analytics/room-usage
 * @access Private
 * Powers the room usage pie chart.
 */
const getRoomUsage = asyncHandler(async (req, res) => {
  const rooms = await Room.find({ user: req.user._id }).lean();
  const agg = await Appliance.aggregate([
    { $match: { user: req.user._id } },
    { $group: { _id: "$room", usageKwh: { $sum: "$monthlyUsageKwh" } } },
  ]);
  const byRoom = new Map(agg.map((a) => [String(a._id), a.usageKwh]));

  const data = rooms.map((r) => ({
    name: r.name,
    value: Number((byRoom.get(String(r._id)) || 0).toFixed(2)),
  }));

  return ApiResponse(res, 200, "Room usage fetched", { data });
});

/**
 * @route GET /api/analytics/consumption-trend
 * @access Private
 * Powers the daily/monthly consumption trend chart from billing history.
 */
const getConsumptionTrend = asyncHandler(async (req, res) => {
  const bills = await Bill.find({ user: req.user._id })
    .sort({ createdAt: 1 })
    .select("billingMonth unitsConsumed billAmount createdAt");

  const data = bills.map((b) => ({
    date: b.billingMonth || b.createdAt.toISOString().slice(0, 7),
    units: b.unitsConsumed || 0,
    billAmount: b.billAmount || 0,
  }));

  return ApiResponse(res, 200, "Consumption trend fetched", { data });
});

/**
 * @route GET /api/analytics/savings-tips
 * @access Private
 */
const getSavingsTips = asyncHandler(async (req, res) => {
  const appliances = await Appliance.find({ user: req.user._id });
  const tips = generateSavingsTips(appliances);
  return ApiResponse(res, 200, "Savings tips generated", { tips });
});

module.exports = { getSummary, getRoomUsage, getConsumptionTrend, getSavingsTips };
