const express = require("express");
const {
  getSummary, getRoomUsage, getConsumptionTrend, getSavingsTips,
} = require("../controllers/analyticsController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/summary", getSummary);
router.get("/room-usage", getRoomUsage);
router.get("/consumption-trend", getConsumptionTrend);
router.get("/savings-tips", getSavingsTips);

module.exports = router;
