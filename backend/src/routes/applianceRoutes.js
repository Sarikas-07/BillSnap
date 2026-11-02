const express = require("express");
const {
  getAppliances, getApplianceById, createAppliance,
  updateAppliance, toggleAppliance, deleteAppliance,
} = require("../controllers/applianceController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.route("/").get(getAppliances).post(createAppliance);
router.route("/:id").get(getApplianceById).put(updateAppliance).delete(deleteAppliance);
router.patch("/:id/toggle", toggleAppliance);

module.exports = router;
