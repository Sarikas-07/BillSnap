const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

/**
 * @route POST /api/auth/signup
 * @desc  Register a new user. Password is hashed by the User model's
 *        pre-save hook (bcrypt) — never hash it here as well.
 */
const signup = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email, and password are required");
  }
  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const user = await User.create({ name, email, password, phone });
  const token = generateToken(user._id);

  return ApiResponse(res, 201, "Account created successfully", {
    user: user.toSafeObject(),
    token,
  });
});

/**
 * @route POST /api/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const match = await user.comparePassword(password);
  if (!match) {
    throw new ApiError(401, "Invalid email or password");
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  const token = generateToken(user._id);

  return ApiResponse(res, 200, "Logged in successfully", {
    user: user.toSafeObject(),
    token,
  });
});

/**
 * @route GET /api/auth/me
 * @access Private
 */
const getMe = asyncHandler(async (req, res) => {
  return ApiResponse(res, 200, "Current user fetched", { user: req.user.toSafeObject() });
});

/**
 * @route POST /api/auth/logout
 * @access Private
 * JWTs are stateless, so "logout" is just a client-side token discard.
 * This endpoint exists for API symmetry / future token-blacklisting.
 */
const logout = asyncHandler(async (req, res) => {
  return ApiResponse(res, 200, "Logged out successfully");
});

module.exports = { signup, login, getMe, logout };
