import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import sequelize from "../models/db.js";
dotenv.config();
// Adjust the import path as necessary
// Make sure your DB pool is imported

// Rate limiter for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3,
  message: "Too many login attempts, please try again later",
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many login attempts, please try again later",
    });
  },
});

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, error: "Username and password are required." });
  }
  console.log("Login attempt:", email);

  try {
    const result = await sequelize.query(
      "SELECT * FROM users WHERE email = ?",
      {
        replacements: [email],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    console.log(result, "ppppppppppp");

    if (result.length === 0) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials." });
    }

    const user = result[0];
    console.log(user, "user", result.password, "result");

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: "Your account is inactive. Please contact support.",
      });
    }

    const isPasswordMatched = await compare(password, user.password);
    console.log(isPasswordMatched, "ppppppppppppppppp");

    if (!isPasswordMatched) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.usertype },
      "pppppppp",
      { expiresIn: "1h" }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 3600000,
    };

    console.log(`User logged in: ${user.id} (${user.usertype})`);

    return res
      .cookie("token", token, cookieOptions)
      .status(200)
      .json({
        success: true,
        message: "Logged in successfully",
        user: {
          id: user.id,
          email: user.email,
          role: user.usertype,
        },
      });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export { login, loginLimiter };
