import express from "express";
import Users from "../models/userModel.js";
import { Op } from "sequelize";
import bcrypt from "bcryptjs";
import pgPool from "../models/pgPool.js"; // pg client for raw SQL queries

const router = express.Router();

// Create user and link to data_request
router.post("/", async (req, res) => {
  try {
    const {
      fname,
      lname,
      email,
      phone,
      password,
      usertype,
      isActive,
      dataRequestId,
    } = req.body;

    if (!dataRequestId) {
      return res.status(400).json({ error: "dataRequestId is required" });
    }

    // Hash the password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user using Sequelize
    const newUser = await Users.create({
      fname,
      lname,
      email,
      phone,
      password: hashedPassword,
      usertype,
      isActive,
    });

    const userId = newUser.id;

    // Update the corresponding data_request to set status and link user_id
    const updateResult = await pgPool.query(
      `UPDATE data_requests
       SET status = $1, user_id = $2
       WHERE id = $3
       RETURNING *`,
      ["created", userId, dataRequestId]
    );

    if (updateResult.rowCount === 0) {
      console.warn("⚠️ No data_request updated. Possibly wrong ID.");
      return res.status(404).json({ error: "Data request not found" });
    }

    const updatedRequest = updateResult.rows[0];
    const pointId = updatedRequest.point_id;

    // ✅ Insert into payments table using userId and pointId
    await pgPool.query(
      `INSERT INTO payments (user_id, point_id, created_at)
   VALUES ($1, $2, NOW())`,
      [userId, pointId]
    );

    return res.status(201).json({
      message:
        "User created, data request updated, and payment record inserted",
      user: newUser,
      updatedRequest,
    });
  } catch (err) {
    console.error(
      "❌ Failed to create user, update data request, or insert payment:",
      err
    );
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
