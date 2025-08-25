import express from "express";
import multer from "multer";
import { fileTypeFromBuffer } from "file-type";
import pgPool from "../models/pgPool.js";

const router = express.Router();

// Memory storage to access file.buffer directly
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed."));
    }
    cb(null, true);
  },
});

// 🔘 Submit a data request (with PDF letter upload)
router.post("/", upload.single("letter"), async (req, res) => {
  const { pointId, fname, lname, email, phone } = req.body;
  const fileBuffer = req.file?.buffer;

  if (!pointId || !fname || !lname || !email || !phone || !fileBuffer) {
    return res
      .status(400)
      .json({ message: "All fields and PDF letter are required." });
  }

  try {
    // 🔍 Deep file content validation
    const fileType = await fileTypeFromBuffer(fileBuffer);
    if (!fileType || fileType.mime !== "application/pdf") {
      return res
        .status(400)
        .json({ message: "Uploaded file is not a valid PDF." });
    }

    const result = await pgPool.query(
      `INSERT INTO data_requests (point_id, fname, lname, email, phone, letter)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [[pointId], fname, lname, email, phone, fileBuffer]
    );

    res.status(201).json({
      message: "Data request submitted successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error saving data request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 🧾 Fetch all data requests (excluding the letter for performance)
router.get("/", async (req, res) => {
  try {
    const result = await pgPool.query(
      `SELECT * FROM data_requests ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching requests:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET letter by ID
router.get("/:id/letter", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pgPool.query(
      "SELECT letter FROM data_requests WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0 || !result.rows[0].letter) {
      return res.status(404).json({ message: "Letter not found" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.send(result.rows[0].letter); // letter is a BYTEA buffer
  } catch (err) {
    console.error("Error fetching letter PDF:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
