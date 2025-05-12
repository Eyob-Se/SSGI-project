// server/server.js

import express from "express";
import cors from "cors";
import pool from "./db.js"; // Import the pool from db.js to interact with the database

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Allow cross-origin requests (CORS)
app.use(express.json()); // Parse incoming JSON requests

// Test route to check if DB connection works
app.get("/api/test-db", async (req, res) => {
  try {
    // Test the database connection by querying the current time
    const result = await pool.query("SELECT NOW()");
    res.json({
      success: true,
      serverTime: result.rows[0].now, // Get the current time from the DB
    });
  } catch (err) {
    console.error("Database connection failed:", err);
    res
      .status(500)
      .json({ success: false, error: "Database connection failed" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
