const express = require("express");
const { getRiskAnalysis } = require("../controllers/riskController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/analyze", protect, getRiskAnalysis);

module.exports = router;
