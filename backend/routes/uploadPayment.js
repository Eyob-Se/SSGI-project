import express from "express";
import multer from "multer";
import pgPool from "../models/pgPool.js";
import { authenticateUser } from "../models/authjwt.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  "/upload",
  authenticateUser,
  upload.single("receipt"),
  async (req, res) => {
    try {
      const { amount } = req.body;
      const user_id = req.user.id;

      if (!amount || !req.file) {
        return res
          .status(400)
          .json({ error: "Amount and receipt file are required." });
      }

      const uploadedFile = req.file.buffer;
      const mimeType = req.file.mimetype;

      // 1. Try updating a rejected payment
      const rejectedResult = await pgPool.query(
        `UPDATE payments
         SET amount = $1,
             uploaded_file = $2,
             mime_type = $3,
             status = 'pending',
             created_at = NOW()
         WHERE id = (
           SELECT id FROM payments
           WHERE user_id = $4 AND status = 'rejected'
           ORDER BY created_at DESC
           LIMIT 1
         )
         RETURNING id`,
        [amount, uploadedFile, mimeType, user_id]
      );

      if (rejectedResult.rowCount > 0) {
        return res.status(200).json({
          message: "Rejected payment updated successfully",
          paymentId: rejectedResult.rows[0].id,
        });
      }

      // 2. Else try updating latest payment with amount IS NULL
      const updateResult = await pgPool.query(
        `UPDATE payments
         SET amount = $1,
             uploaded_file = $2,
             mime_type = $3,
             status = 'pending',
             created_at = NOW()
         WHERE id = (
           SELECT id FROM payments
           WHERE user_id = $4 AND amount IS NULL
           ORDER BY created_at DESC
           LIMIT 1
         )
         RETURNING id`,
        [amount, uploadedFile, mimeType, user_id]
      );

      if (updateResult.rowCount === 0) {
        return res.status(404).json({
          error: "No eligible payment record found to update.",
        });
      }

      res.status(200).json({
        message: "Payment uploaded successfully",
        paymentId: updateResult.rows[0].id,
      });
    } catch (err) {
      console.error("Payment upload error:", err.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
