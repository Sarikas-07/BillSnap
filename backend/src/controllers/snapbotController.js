const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const ChatMessage = require("../models/ChatMessage");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const { getSnapbotReply } = require("../services/snapbotService");

/**
 * @route POST /api/snapbot/message
 * @access Private
 * Body: { message: string, sessionId?: string }
 * Persists both the user's message and SnapBot's reply, so history
 * survives page reloads and can be replayed via GET /api/snapbot/history.
 */
const sendMessage = asyncHandler(async (req, res) => {
  const { message, sessionId } = req.body;
  if (!message || !message.trim()) {
    throw new ApiError(400, "message is required");
  }

  const session = sessionId || crypto.randomUUID();

  await ChatMessage.create({
    user: req.user._id,
    sessionId: session,
    from: "user",
    text: message,
  });

  const { text, intent } = await getSnapbotReply(req.user._id, message);

  const botMessage = await ChatMessage.create({
    user: req.user._id,
    sessionId: session,
    from: "bot",
    text,
    intent,
  });

  return ApiResponse(res, 200, "Reply generated", {
    sessionId: session,
    reply: { id: botMessage._id, text, intent, createdAt: botMessage.createdAt },
  });
});

/**
 * @route GET /api/snapbot/history?sessionId=...
 * @access Private
 * Without sessionId, returns the most recent session's messages.
 */
const getHistory = asyncHandler(async (req, res) => {
  let { sessionId } = req.query;

  if (!sessionId) {
    const last = await ChatMessage.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    if (!last) return ApiResponse(res, 200, "No chat history yet", { sessionId: null, messages: [] });
    sessionId = last.sessionId;
  }

  const messages = await ChatMessage.find({ user: req.user._id, sessionId }).sort({ createdAt: 1 });
  return ApiResponse(res, 200, "History fetched", { sessionId, messages });
});

/**
 * @route GET /api/snapbot/sessions
 * @access Private
 * Lists distinct chat sessions for the user, most recent first.
 */
const getSessions = asyncHandler(async (req, res) => {
  const sessions = await ChatMessage.aggregate([
    { $match: { user: req.user._id } },
    {
      $group: {
        _id: "$sessionId",
        lastMessageAt: { $max: "$createdAt" },
        messageCount: { $sum: 1 },
      },
    },
    { $sort: { lastMessageAt: -1 } },
  ]);

  return ApiResponse(res, 200, "Sessions fetched", { sessions });
});

/**
 * @route DELETE /api/snapbot/history/:sessionId
 * @access Private
 */
const clearHistory = asyncHandler(async (req, res) => {
  await ChatMessage.deleteMany({ user: req.user._id, sessionId: req.params.sessionId });
  return ApiResponse(res, 200, "Session cleared");
});

module.exports = { sendMessage, getHistory, getSessions, clearHistory };
