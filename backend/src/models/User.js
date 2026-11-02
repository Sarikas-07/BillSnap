const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // never returned by default
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    avatarPublicId: {
      type: String,
      default: "",
    },
    homeName: {
      type: String,
      default: "My Home",
    },
    address: {
      type: String,
      default: "",
    },
    discomProvider: {
      type: String,
      default: "",
    },
    billingCycleStart: {
      type: Number, // day of month, 1-28
      default: 1,
    },
    plan: {
      type: String,
      enum: ["Free Plan", "Premium Plan"],
      default: "Free Plan",
    },
    notificationPreferences: {
      billAlerts: { type: Boolean, default: true },
      riskAlerts: { type: Boolean, default: true },
      weeklyDigest: { type: Boolean, default: false },
      snapbotTips: { type: Boolean, default: true },
    },
    lastLoginAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Hash password before save, only if modified
userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to compare plaintext password against the hash
userSchema.methods.comparePassword = async function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Strip sensitive/internal fields whenever a user doc is serialized
userSchema.methods.toSafeObject = function toSafeObject() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
