const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");

/**
 * Streams an in-memory file buffer (from multer) up to Cloudinary.
 * Returns { url, publicId }.
 */
function uploadBufferToCloudinary(buffer, folder = "billsnap/bills") {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

async function deleteFromCloudinary(publicId) {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
}

module.exports = { uploadBufferToCloudinary, deleteFromCloudinary };
