const express = require("express");
const { getRooms, createRoom, updateRoom, deleteRoom } = require("../controllers/roomController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.route("/").get(getRooms).post(createRoom);
router.route("/:id").put(updateRoom).delete(deleteRoom);

module.exports = router;
