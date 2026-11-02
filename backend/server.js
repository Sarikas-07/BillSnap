require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`[BillSnap API] Listening on http://localhost:${PORT}`);
    console.log(`[BillSnap API] Environment: ${process.env.NODE_ENV || "development"}`);
  });

  process.on("unhandledRejection", (err) => {
    console.error(`[Unhandled Rejection] ${err.message}`);
    server.close(() => process.exit(1));
  });
}

start();
