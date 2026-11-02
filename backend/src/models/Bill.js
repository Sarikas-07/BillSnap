const mongoose = require("mongoose");

const slabSchema = new mongoose.Schema(
  {
    slab: String,
    range: String,
    units: Number,
    rate: Number,
    amount: Number,
  },
  { _id: false }
);

const billSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    customerNumber: {
      type: String,
      trim: true,
    },
    billingMonth: {
      // e.g. "May 2026"
      type: String,
      trim: true,
    },
    unitsConsumed: {
      type: Number,
      min: 0,
    },
    billAmount: {
      type: Number,
      min: 0,
    },
    dueDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Good", "Paid", "Unpaid", "Overdue", "Unknown"],
      default: "Unknown",
    },
    slabs: {
      type: [slabSchema],
      default: [],
    },
    fixedCharge: { type: Number, default: 0 },
    taxesFees: { type: Number, default: 0 },
    carbonFootprintKg: { type: Number, default: 0 },

    imageUrl: { type: String, default: "" },
    imagePublicId: { type: String, default: "" },

    source: {
      type: String,
      enum: ["ocr-upload", "manual"],
      default: "ocr-upload",
    },
    ocrConfidence: {
      type: Number, // 0-1
      default: 0,
    },
    rawOcrText: {
      type: String,
      default: "",
      select: false,
    },
  },
  { timestamps: true }
);

billSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Bill", billSchema);
