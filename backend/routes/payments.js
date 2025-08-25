import express from "express";
import pgPool from "../models/pgPool.js";
import { sendEmail } from "../controllers/sendEmail.js"; // ✅ Add this import

const router = express.Router();

// GET all payments
router.get("/", async (req, res) => {
  try {
    const result = await pgPool.query(
      "SELECT * FROM payments ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET file by payment ID
router.get("/:id/file", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pgPool.query(
      "SELECT uploaded_file, mime_type FROM payments WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0 || !result.rows[0].uploaded_file) {
      return res.status(404).send("No file found");
    }

    const fileBuffer = result.rows[0].uploaded_file;
    const mimeType = result.rows[0].mime_type || "application/octet-stream";

    res.setHeader("Content-Type", mimeType);
    res.setHeader("Content-Disposition", "inline");
    res.send(fileBuffer);
  } catch (err) {
    console.error("Error sending file:", err);
    res.status(500).send("Error retrieving file");
  }
});

// ✅ PUT: Update payment status and send email
router.put("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status, point_id } = req.body; // point_id should be an array of strings

  if (!["verified", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  try {
    // Get payment with user info
    const result = await pgPool.query(
      `SELECT p.*, u.email, u.fname 
       FROM payments p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Payment not found" });
    }

    const payment = result.rows[0];

    // Combine existing point_id array with new point_id array, avoiding duplicates
    // Use unnest and array_agg(DISTINCT ...) for uniqueness

    const updatedPointsRes = await pgPool.query(
      `SELECT ARRAY(
          SELECT DISTINCT unnest(
            COALESCE(point_id, '{}') || $1::text[]
          )
        ) AS combined_points
       FROM payments
       WHERE id = $2`,
      [point_id, id]
    );

    const combinedPoints = updatedPointsRes.rows[0].combined_points;

    // Update payment status and combined point_id array
    const updateRes = await pgPool.query(
      `UPDATE payments SET status = $1, point_id = $2 WHERE id = $3 RETURNING *`,
      [status, combinedPoints, id]
    );

    // Send email notification
    const subject =
      status === "verified" ? "Payment Verified" : "Payment Rejected";
    const message =
      status === "verified"
        ? `Hello ${payment.fname},\n\nYour payment of ${payment.amount} ETB has been successfully verified.`
        : `Hello ${payment.fname},\n\nUnfortunately, your payment of ${payment.amount} ETB has been rejected. Please upload a valid receipt.`;

    await sendEmail({
      to: payment.email,
      subject,
      html: `<p>${message.replace(/\n/g, "<br>")}</p>`,
    });

    res.json({
      message: `Payment ${status} successfully`,
      payment: updateRes.rows[0],
    });
  } catch (err) {
    console.error("Error updating payment status or sending email:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
