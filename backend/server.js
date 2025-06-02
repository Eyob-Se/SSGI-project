import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import geoRoutes from "./routes/geo.js";
import geo1Routes from "./routes/geo1.js";
import login from "./routes/login.js";
import sequelize from "./models/db.js"; // adjust path

const app = express();
let PORT = 8000; // Starting port

app.use(
  cors({
    origin: "http://localhost:5173", // Adjust this to your frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/login", login);
app.use("/api/geo", geoRoutes);
app.use("/api/geo1", geo1Routes);

async function startServer(port) {
  try {
    await sequelize.sync({ alter: true }); // wait for DB sync
    console.log("✅ Sequelize sync successful");

    const server = app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });

    // Catch listen errors (like port in use)
    server.on("error", async (err) => {
      if (err.code === "EADDRINUSE") {
        console.warn(`⚠️ Port ${port} is in use, trying ${port + 1}...`);
        startServer(port + 1);
      } else {
        console.error("❌ Server error:", err);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error("❌ Failed to sync DB or start server:");
    console.error(error.message);
    process.exit(1);
  }
}

startServer(PORT);
