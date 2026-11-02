const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const roomRoutes = require("./routes/roomRoutes");
const applianceRoutes = require("./routes/applianceRoutes");
const billRoutes = require("./routes/billRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const predictionRoutes = require("./routes/predictionRoutes");
const riskRoutes = require("./routes/riskRoutes");
const snapbotRoutes = require("./routes/snapbotRoutes");

const app = express();

// --- Core middleware ---
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : "*",
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== "test") {
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
}

// Basic rate limiting on auth routes to slow down brute-force attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts, please try again later" },
});
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/signup", authLimiter);

// --- Health check ---
app.get("/health", (req, res) => {
  res.json({ success: true, message: "BillSnap API is running", timestamp: new Date().toISOString() });
});

// --- API routes ---
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/appliances", applianceRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/prediction", predictionRoutes);
app.use("/api/risk", riskRoutes);
app.use("/api/snapbot", snapbotRoutes);

// --- 404 + error handler (must be last) ---
app.use(notFound);
app.use(errorHandler);

module.exports = app;
