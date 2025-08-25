import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

// Hardcoded credentials (replace with your real values)
const MAIL_USER = "ayanoeyob346@gmail.com";
const MAIL_PASS = "hrnlankkbmkcuwwx"; // Gmail App Password, no spaces

// POST /api/send-email
router.post("/", async (req, res) => {
  const { email, subject, message } = req.body;

  if (!email || !subject || !message) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"COR GIS System" <${MAIL_USER}>`,
      to: email,
      subject: subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ message: "Failed to send email", error });
  }
});

export default router;
