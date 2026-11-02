const express = require("express");
const {
  uploadBill, createBillManually, getBills,
  getLatestBill, getBillById, updateBill, deleteBill,
} = require("../controllers/billController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.use(protect);

router.post("/upload", upload.single("bill"), uploadBill);
router.route("/").get(getBills).post(createBillManually);
router.get("/latest", getLatestBill);
router.route("/:id").get(getBillById).put(updateBill).delete(deleteBill);

module.exports = router;
