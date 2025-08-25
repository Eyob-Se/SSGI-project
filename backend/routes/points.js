// routes/userPoints.js
import express from "express";
import pgPool from "../models/pgPool.js";
import { authenticateUser } from "../models/authjwt.js"; // middleware that adds req.user

const router = express.Router();

router.get("/points", authenticateUser, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pgPool.query(
      `SELECT DISTINCT point_id
       FROM payments
       WHERE user_id = $1 AND status = 'verified'`,
      [userId]
    );

    res.status(200).json(result.rows); // [{ point_id: "ABC123" }, ...]
  } catch (err) {
    console.error("Error fetching user points:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:pointId", async (req, res) => {
  const { pointId } = req.params;

  try {
    // Try first_order
    let result = await pgPool.query(
      `SELECT * FROM first_order WHERE id = $1 LIMIT 1`,
      [pointId]
    );

    if (result.rows.length === 0) {
      // Try zero_order if not found in first_order
      result = await pgPool.query(
        `SELECT * FROM zero_order WHERE id = $1 LIMIT 1`,
        [pointId]
      );
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Point not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching point:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
export default router;
