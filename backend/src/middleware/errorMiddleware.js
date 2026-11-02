const ApiError = require("../utils/ApiError");

/** Catches unmatched routes and forwards a 404 to the error handler. */
function notFound(req, res, next) {
  next(new ApiError(404, `Route not found — ${req.originalUrl}`));
}

/** Centralised error handler. Must be registered last in app.js. */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  let statusCode = err instanceof ApiError ? err.statusCode : err.statusCode || 500;
  let message = err.message || "Internal server error";

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for field '${err.path}'`;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // Mongo duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = `${field} already exists`;
  }

  res.status(statusCode).json({
    success: false,
    message,
    details: err.details,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
}

module.exports = { notFound, errorHandler };
