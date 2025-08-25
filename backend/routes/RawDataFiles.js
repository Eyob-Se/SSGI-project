// routes/rawDataFiles.js
import express from "express";
import pgPool from "../models/pgPool.js";
import { authenticateUser } from "../models/authjwt.js"; // optional auth middleware

const router = express.Router();

// GET all file metadata (title, description, filename, size, etc)
router.get("/files", authenticateUser, async (req, res) => {
  try {
    const query = `
      SELECT id, title, description, filename, mimetype, size_bytes, uploaded_at
      FROM control_point_files
      ORDER BY uploaded_at DESC
    `;

    const result = await pgPool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching raw data files metadata:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET file download by id
router.get("/files/:id/download", authenticateUser, async (req, res) => {
  const fileId = req.params.id;

  try {
    const query = `
      SELECT filename, mimetype, data
      FROM control_point_files
      WHERE id = $1
    `;

    const result = await pgPool.query(query, [fileId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "File not found" });
    }

    const file = result.rows[0];

    res.set({
      "Content-Type": file.mimetype,
      "Content-Disposition": `attachment; filename="${file.filename}"`,
      "Content-Length": file.data.length,
    });

    res.send(file.data);
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE file by id
router.delete("/files/:id", authenticateUser, async (req, res) => {
  const fileId = req.params.id;

  try {
    const result = await pgPool.query(
      "DELETE FROM control_point_files WHERE id = $1 RETURNING *",
      [fileId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "File not found" });
    }

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
