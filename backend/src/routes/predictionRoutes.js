const express = require("express");
const { getForecast } = require("../controllers/predictionController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/forecast", protect, getForecast);

module.exports = router;
