const express = require("express");
const { sendMessage, getHistory, getSessions, clearHistory } = require("../controllers/snapbotController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/message", sendMessage);
router.get("/history", getHistory);
router.get("/sessions", getSessions);
router.delete("/history/:sessionId", clearHistory);

module.exports = router;
