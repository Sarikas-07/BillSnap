const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Room name is required"],
      trim: true,
    },
    icon: {
      type: String,
      enum: ["sofa", "cooking", "bed", "washer", "shower", "desk"],
      default: "sofa",
    },
  },
  { timestamps: true }
);

roomSchema.index({ user: 1, name: 1 }, { unique: true });

// Virtual: populated on demand via .populate("applianceCount")
roomSchema.virtual("appliances", {
  ref: "Appliance",
  localField: "_id",
  foreignField: "room",
});

roomSchema.set("toJSON", { virtuals: true });
roomSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Room", roomSchema);
