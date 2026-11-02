const mongoose = require("mongoose");

/**
 * Connects to MongoDB Atlas using the URI in process.env.MONGO_URI.
 * Called once from server.js on boot.
 */
async function connectDB() {
  try {
    mongoose.set("strictQuery", true);

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`[MongoDB] Connected: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on("error", (err) => {
      console.error(`[MongoDB] Connection error: ${err.message}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("[MongoDB] Disconnected");
    });
  } catch (error) {
    console.error(`[MongoDB] Initial connection failed: ${error.message}`);
    process.exit(1);
  }
}

module.exports = connectDB;
