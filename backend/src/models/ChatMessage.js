const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sessionId: {
      // groups a conversation together; a new one is created per chat widget session
      type: String,
      required: true,
      index: true,
    },
    from: {
      type: String,
      enum: ["user", "bot"],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    intent: {
      // which SnapBot rule/topic matched, useful for analytics/debugging
      type: String,
      default: "general",
    },
  },
  { timestamps: true }
);

chatMessageSchema.index({ user: 1, sessionId: 1, createdAt: 1 });

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
