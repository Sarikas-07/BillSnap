const asyncHandler = require("express-async-handler");
const Bill = require("../models/Bill");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const { uploadBufferToCloudinary } = require("../services/cloudinaryService");
const { extractBillFromImage } = require("../services/aiService");

/**
 * @route POST /api/bills/upload
 * @access Private
 * Accepts multipart/form-data with a single "bill" file. Runs OCR via the
 * FastAPI AI service, stores the original image in Cloudinary, and saves
 * the structured result to MongoDB.
 */
const uploadBill = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No bill file uploaded — attach a field named 'bill'");
  }

  // Run OCR extraction and the Cloudinary upload in parallel.
  const [extracted, cloudinaryResult] = await Promise.all([
    extractBillFromImage(req.file.buffer, req.file.originalname, req.file.mimetype),
    uploadBufferToCloudinary(req.file.buffer, "billsnap/bills"),
  ]);

  const bill = await Bill.create({
    user: req.user._id,
    customerNumber: extracted.customerNumber,
    billingMonth: extracted.billingMonth,
    unitsConsumed: extracted.unitsConsumed,
    billAmount: extracted.billAmount,
    dueDate: extracted.dueDate ? new Date(extracted.dueDate) : undefined,
    status: extracted.status || "Unknown",
    slabs: extracted.slabs || [],
    fixedCharge: extracted.fixedCharge || 0,
    taxesFees: extracted.taxesFees || 0,
    carbonFootprintKg: extracted.carbonFootprintKg || 0,
    imageUrl: cloudinaryResult.url,
    imagePublicId: cloudinaryResult.publicId,
    source: "ocr-upload",
    ocrConfidence: extracted.confidence || 0,
    rawOcrText: extracted.rawText || "",
  });

  return ApiResponse(res, 201, "Bill uploaded and processed", { bill });
});

/**
 * @route POST /api/bills
 * @access Private
 * Manual entry fallback if OCR misreads a field.
 */
const createBillManually = asyncHandler(async (req, res) => {
  const bill = await Bill.create({ ...req.body, user: req.user._id, source: "manual" });
  return ApiResponse(res, 201, "Bill saved", { bill });
});

/**
 * @route GET /api/bills
 * @access Private
 */
const getBills = asyncHandler(async (req, res) => {
  const bills = await Bill.find({ user: req.user._id }).sort({ createdAt: -1 });
  return ApiResponse(res, 200, "Bills fetched", { bills });
});

/**
 * @route GET /api/bills/latest
 * @access Private
 */
const getLatestBill = asyncHandler(async (req, res) => {
  const bill = await Bill.findOne({ user: req.user._id }).sort({ createdAt: -1 });
  return ApiResponse(res, 200, "Latest bill fetched", { bill });
});

/**
 * @route GET /api/bills/:id
 * @access Private
 */
const getBillById = asyncHandler(async (req, res) => {
  const bill = await Bill.findOne({ _id: req.params.id, user: req.user._id });
  if (!bill) throw new ApiError(404, "Bill not found");
  return ApiResponse(res, 200, "Bill fetched", { bill });
});

/**
 * @route PUT /api/bills/:id
 * @access Private
 * Lets a user correct OCR mistakes.
 */
const updateBill = asyncHandler(async (req, res) => {
  const bill = await Bill.findOne({ _id: req.params.id, user: req.user._id });
  if (!bill) throw new ApiError(404, "Bill not found");

  const editable = [
    "customerNumber", "billingMonth", "unitsConsumed", "billAmount",
    "dueDate", "status", "slabs", "fixedCharge", "taxesFees", "carbonFootprintKg",
  ];
  editable.forEach((field) => {
    if (req.body[field] !== undefined) bill[field] = req.body[field];
  });

  await bill.save();
  return ApiResponse(res, 200, "Bill updated", { bill });
});

/**
 * @route DELETE /api/bills/:id
 * @access Private
 */
const deleteBill = asyncHandler(async (req, res) => {
  const bill = await Bill.findOne({ _id: req.params.id, user: req.user._id });
  if (!bill) throw new ApiError(404, "Bill not found");
  await bill.deleteOne();
  return ApiResponse(res, 200, "Bill deleted");
});

module.exports = {
  uploadBill, createBillManually, getBills,
  getLatestBill, getBillById, updateBill, deleteBill,
};
