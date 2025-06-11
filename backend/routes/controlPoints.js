// routes/controlPoints.js
import express from "express";
import multer from "multer";
import pgPool from "../models/pgPool.js"; // <-- ✨ use the shared raw-SQL pool

const router = express.Router();

// ──────────────────────────────────────────────────────────
// Multer: keep file in memory, 25 MB limit, MIME whitelist
// ──────────────────────────────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
  fileFilter: (_req, file, cb) => {
    const ok = [
      "text/csv",
      "text/plain",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/zip",
    ].includes(file.mimetype);
    cb(null, ok);
  },
});

// ──────────────────────────────────────────────────────────
//  POST /api/control-points  ← field name must be 'file'
// ──────────────────────────────────────────────────────────
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!req.file || !title) {
      return res.status(400).json({ error: "Title and file are required." });
    }

    const { originalname, mimetype, size, buffer } = req.file;

    const { rows } = await pgPool.query(
      `INSERT INTO control_point_files
         (title, description, filename, mimetype, size_bytes, data)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
      [title, description, originalname, mimetype, size, buffer]
    );

    return res.status(201).json({ id: rows[0].id });
  } catch (err) {
    console.error("Upload error:", err); // log full error
    return res.status(500).json({ error: err.message || "Upload failed." }); // return exact cause
  }
});

export default router;
