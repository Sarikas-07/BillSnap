const asyncHandler = require("express-async-handler");
const Appliance = require("../models/Appliance");
const Room = require("../models/Room");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

/**
 * @route GET /api/appliances
 * @access Private
 * Optional query params: ?room=<roomId>&status=true|false
 */
const getAppliances = asyncHandler(async (req, res) => {
  const filter = { user: req.user._id };
  if (req.query.room) filter.room = req.query.room;
  if (req.query.status !== undefined) filter.status = req.query.status === "true";

  const appliances = await Appliance.find(filter).populate("room", "name icon").sort({ createdAt: -1 });
  return ApiResponse(res, 200, "Appliances fetched", { appliances });
});

/**
 * @route GET /api/appliances/:id
 * @access Private
 */
const getApplianceById = asyncHandler(async (req, res) => {
  const appliance = await Appliance.findOne({ _id: req.params.id, user: req.user._id }).populate("room", "name icon");
  if (!appliance) throw new ApiError(404, "Appliance not found");
  return ApiResponse(res, 200, "Appliance fetched", { appliance });
});

/**
 * @route POST /api/appliances
 * @access Private
 */
const createAppliance = asyncHandler(async (req, res) => {
  const { room, name, deviceType, powerRatingWatts, quantity, hoursUsedDaily, status, installedYear } = req.body;

  if (!room || !name || !deviceType || powerRatingWatts === undefined || hoursUsedDaily === undefined) {
    throw new ApiError(400, "room, name, deviceType, powerRatingWatts, and hoursUsedDaily are required");
  }

  const roomDoc = await Room.findOne({ _id: room, user: req.user._id });
  if (!roomDoc) throw new ApiError(404, "Room not found");

  const appliance = await Appliance.create({
    user: req.user._id,
    room,
    name,
    deviceType,
    powerRatingWatts,
    quantity,
    hoursUsedDaily,
    status,
    installedYear,
  });

  return ApiResponse(res, 201, "Appliance added", { appliance });
});

/**
 * @route PUT /api/appliances/:id
 * @access Private
 */
const updateAppliance = asyncHandler(async (req, res) => {
  const appliance = await Appliance.findOne({ _id: req.params.id, user: req.user._id });
  if (!appliance) throw new ApiError(404, "Appliance not found");

  const editable = [
    "room", "name", "deviceType", "powerRatingWatts",
    "quantity", "hoursUsedDaily", "status", "installedYear",
  ];
  editable.forEach((field) => {
    if (req.body[field] !== undefined) appliance[field] = req.body[field];
  });

  await appliance.save();
  return ApiResponse(res, 200, "Appliance updated", { appliance });
});

/**
 * @route PATCH /api/appliances/:id/toggle
 * @access Private
 * Quick on/off toggle used by the Appliance Management table switch.
 */
const toggleAppliance = asyncHandler(async (req, res) => {
  const appliance = await Appliance.findOne({ _id: req.params.id, user: req.user._id });
  if (!appliance) throw new ApiError(404, "Appliance not found");

  appliance.status = !appliance.status;
  await appliance.save();

  return ApiResponse(res, 200, "Appliance status toggled", { appliance });
});

/**
 * @route DELETE /api/appliances/:id
 * @access Private
 */
const deleteAppliance = asyncHandler(async (req, res) => {
  const appliance = await Appliance.findOne({ _id: req.params.id, user: req.user._id });
  if (!appliance) throw new ApiError(404, "Appliance not found");

  await appliance.deleteOne();
  return ApiResponse(res, 200, "Appliance deleted");
});

module.exports = {
  getAppliances, getApplianceById, createAppliance,
  updateAppliance, toggleAppliance, deleteAppliance,
};
