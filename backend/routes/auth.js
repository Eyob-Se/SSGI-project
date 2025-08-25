import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Users from "../models/userModel.js";
import { sendEmail } from "../controllers/sendEmail.js"; // ✅ reuse logic

const router = express.Router();

const JWT_SECRET = "your-super-secret-key";
const FRONTEND_URL = "http://localhost:5173";

// Forgot Password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Users.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found." });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "15m" });

    const resetLink = `${FRONTEND_URL}/reset-password/${token}`;

    await sendEmail({
      to: email,
      subject: "Reset Your Password",
      html: `<p>Click below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
    });

    res.json({ message: "Reset link sent to your email." });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// Reset Password
router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res
      .status(400)
      .json({ error: "Token and new password are required." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await Users.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password has been reset successfully." });
  } catch (err) {
    console.error("Reset password error:", err);
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({ error: "Reset token has expired." });
    }
    res.status(400).json({ error: "Invalid reset token." });
  }
});

export default router;
