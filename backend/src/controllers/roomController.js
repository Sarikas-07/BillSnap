const asyncHandler = require("express-async-handler");
const Room = require("../models/Room");
const Appliance = require("../models/Appliance");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

/**
 * @route GET /api/rooms
 * @access Private
 * Returns each room with its appliance count and total monthly usage.
 */
const getRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find({ user: req.user._id }).sort({ createdAt: 1 }).lean();

  const roomIds = rooms.map((r) => r._id);
  const applianceAgg = await Appliance.aggregate([
    { $match: { room: { $in: roomIds } } },
    {
      $group: {
        _id: "$room",
        deviceCount: { $sum: "$quantity" },
        monthlyUsageKwh: { $sum: "$monthlyUsageKwh" },
      },
    },
  ]);
  const statsByRoom = new Map(applianceAgg.map((a) => [String(a._id), a]));

  const enriched = rooms.map((r) => {
    const stats = statsByRoom.get(String(r._id));
    return {
      ...r,
      devices: stats?.deviceCount || 0,
      usageKwh: Number((stats?.monthlyUsageKwh || 0).toFixed(2)),
    };
  });

  return ApiResponse(res, 200, "Rooms fetched", { rooms: enriched });
});

/**
 * @route POST /api/rooms
 * @access Private
 */
const createRoom = asyncHandler(async (req, res) => {
  const { name, icon } = req.body;
  if (!name) throw new ApiError(400, "Room name is required");

  const room = await Room.create({ user: req.user._id, name, icon });
  return ApiResponse(res, 201, "Room created", { room });
});

/**
 * @route PUT /api/rooms/:id
 * @access Private
 */
const updateRoom = asyncHandler(async (req, res) => {
  const room = await Room.findOne({ _id: req.params.id, user: req.user._id });
  if (!room) throw new ApiError(404, "Room not found");

  const { name, icon } = req.body;
  if (name !== undefined) room.name = name;
  if (icon !== undefined) room.icon = icon;
  await room.save();

  return ApiResponse(res, 200, "Room updated", { room });
});

/**
 * @route DELETE /api/rooms/:id
 * @access Private
 * Also removes appliances that belong to this room to avoid orphans.
 */
const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findOne({ _id: req.params.id, user: req.user._id });
  if (!room) throw new ApiError(404, "Room not found");

  await Appliance.deleteMany({ room: room._id, user: req.user._id });
  await room.deleteOne();

  return ApiResponse(res, 200, "Room and its appliances deleted");
});

module.exports = { getRooms, createRoom, updateRoom, deleteRoom };
