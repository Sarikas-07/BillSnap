const mongoose = require("mongoose");

const applianceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Appliance name is required"],
      trim: true,
    },
    deviceType: {
      type: String,
      required: true,
      trim: true,
    },
    powerRatingWatts: {
      type: Number,
      required: [true, "Power rating (W) is required"],
      min: 0,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    hoursUsedDaily: {
      type: Number,
      required: [true, "Daily usage hours is required"],
      min: 0,
      max: 24,
    },
    status: {
      type: Boolean, // true = active/on, false = off/disabled
      default: true,
    },
    installedYear: {
      type: Number,
    },
    // Derived fields, recalculated on every save
    dailyUsageKwh: {
      type: Number,
      default: 0,
    },
    monthlyUsageKwh: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

applianceSchema.pre("save", function computeUsage(next) {
  const kw = (this.powerRatingWatts * this.quantity) / 1000;
  this.dailyUsageKwh = Number((kw * this.hoursUsedDaily).toFixed(3));
  this.monthlyUsageKwh = Number((this.dailyUsageKwh * 30).toFixed(2));
  next();
});

module.exports = mongoose.model("Appliance", applianceSchema);
