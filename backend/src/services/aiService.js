const axios = require("axios");
const FormData = require("form-data");
const ApiError = require("../utils/ApiError");

const AI_BASE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

const aiClient = axios.create({
  baseURL: AI_BASE_URL,
  timeout: 30000,
});

/**
 * Sends the uploaded bill image buffer to the FastAPI OCR endpoint and
 * returns the structured fields it extracted.
 */
async function extractBillFromImage(buffer, filename, mimetype) {
  try {
    const form = new FormData();
    form.append("file", buffer, { filename, contentType: mimetype });

    const { data } = await aiClient.post("/api/ocr/extract", form, {
      headers: form.getHeaders(),
    });

    return data; // { customerNumber, billingMonth, unitsConsumed, billAmount, dueDate, status, confidence, rawText }
  } catch (err) {
    console.error("[aiService] OCR extraction failed:", err.message);
    throw new ApiError(502, "Bill OCR service is unavailable. Please try again shortly.");
  }
}

/**
 * Sends historical bill data points to the FastAPI prediction endpoint
 * and returns a forecast for upcoming months.
 */
async function predictUpcomingBills(history, monthsAhead = 3) {
  try {
    const { data } = await aiClient.post("/api/prediction/forecast", {
      history, // [{ month, unitsConsumed, billAmount }]
      monthsAhead,
    });
    return data; // { predictions: [...], confidence, drivers: [...] }
  } catch (err) {
    console.error("[aiService] Prediction failed:", err.message);
    throw new ApiError(502, "Prediction service is unavailable. Please try again shortly.");
  }
}

module.exports = { extractBillFromImage, predictUpcomingBills, aiClient };
