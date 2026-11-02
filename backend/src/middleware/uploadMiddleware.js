const multer = require("multer");
const ApiError = require("../utils/ApiError");

// Keep uploads in memory — controllers stream the buffer straight to
// Cloudinary and to the FastAPI OCR service, no need to touch disk.
const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
  if (!allowed.includes(file.mimetype)) {
    return cb(new ApiError(400, "Only JPG, PNG, WEBP, or PDF files are allowed"), false);
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

module.exports = upload;
