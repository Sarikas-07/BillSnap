/**
 * Shape every successful response consistently:
 * { success: true, message, data }
 */
function ApiResponse(res, statusCode, message, data = null) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

module.exports = ApiResponse;
