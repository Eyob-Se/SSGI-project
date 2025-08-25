import express from "express";
import pgPool from "../models/pgPool.js";
import { authenticateUser } from "../models/authjwt.js"; // assumes it adds req.user with { id }

const router = express.Router();

// GET /api/profile - fetch user profile
router.get("/", authenticateUser, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pgPool.query(
      `SELECT fname, lname, phone FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/profile - update user profile
router.put("/", authenticateUser, async (req, res) => {
  const userId = req.user.id;
  const { fname, lname, phone } = req.body;

  if (!fname || !lname || !phone) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const result = await pgPool.query(
      `UPDATE users
       SET fname = $1, lname = $2, phone = $3
       WHERE id = $4
       RETURNING fname, lname, phone`,
      [fname, lname, phone, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found or not updated" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      profile: result.rows[0],
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
