const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const { uploadBufferToCloudinary, deleteFromCloudinary } = require("../services/cloudinaryService");

/**
 * @route GET /api/users/profile
 * @access Private
 */
const getProfile = asyncHandler(async (req, res) => {
  return ApiResponse(res, 200, "Profile fetched", { user: req.user.toSafeObject() });
});

/**
 * @route PUT /api/users/profile
 * @access Private
 * Updates editable profile fields only — never email/password here.
 */
const updateProfile = asyncHandler(async (req, res) => {
  const editable = [
    "name", "phone", "homeName", "address", "discomProvider",
    "billingCycleStart", "notificationPreferences",
  ];

  editable.forEach((field) => {
    if (req.body[field] !== undefined) {
      req.user[field] = req.body[field];
    }
  });

  await req.user.save();
  return ApiResponse(res, 200, "Profile updated", { user: req.user.toSafeObject() });
});

/**
 * @route PUT /api/users/password
 * @access Private
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Current and new password are required");
  }
  if (newPassword.length < 6) {
    throw new ApiError(400, "New password must be at least 6 characters");
  }

  const user = await User.findById(req.user._id).select("+password");
  const match = await user.comparePassword(currentPassword);
  if (!match) {
    throw new ApiError(401, "Current password is incorrect");
  }

  user.password = newPassword; // re-hashed by pre-save hook
  await user.save();

  return ApiResponse(res, 200, "Password updated successfully");
});

/**
 * @route PUT /api/users/avatar
 * @access Private
 * Expects multipart/form-data with a single "avatar" file (see uploadMiddleware).
 */
const updateAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No avatar file uploaded");
  }

  if (req.user.avatarPublicId) {
    await deleteFromCloudinary(req.user.avatarPublicId);
  }

  const { url, publicId } = await uploadBufferToCloudinary(req.file.buffer, "billsnap/avatars");

  req.user.avatarUrl = url;
  req.user.avatarPublicId = publicId;
  await req.user.save();

  return ApiResponse(res, 200, "Avatar updated", { user: req.user.toSafeObject() });
});

module.exports = { getProfile, updateProfile, changePassword, updateAvatar };
