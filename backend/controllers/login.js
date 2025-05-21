import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { findOne } from "../models/userModel.js";
import rateLimit from "express-rate-limit";

// Rate limiter for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 5 login attempts per windowMs
  message: "Too many login attempts, please try again later",
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many login attempts, please try again later",
    });
  },
});

// JWT configuration
const jwtConfig = {
  secret:
    process.env.JWT_SECRET ||
    "dfuyu7$@&3khjbjb&hdcGHFGCG)&G@676753221d06!`10,jv+=0866%3#455", // Should be in environment variables
  expiresIn: "1h",
  algorithm: "HS256",
};

const login = async (req, res) => {
  // Input validation
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({
      success: false,
      error: "Email and password are required",
    });
  }

  try {
    // Find user with case-insensitive email
    const userData = await findOne({
      where: {
        email: req.body.email.toLowerCase(),
      },
    });

    if (!userData) {
      // Generic message to prevent user enumeration
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // Timing-safe comparison
    const isPasswordMatched = await compare(
      req.body.password.toString(),
      userData.password
    );

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // Generate JWT token with minimal claims
    const token = sign(
      {
        sub: userData.id, // Standard 'sub' claim
        role: userData.usertype,
      },
      jwtConfig.secret,
      {
        expiresIn: jwtConfig.expiresIn,
        algorithm: jwtConfig.algorithm,
      }
    );

    // Secure cookie settings
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    };

    // Log successful login (without sensitive data)
    console.log(`User logged in: ${userData.id} (${userData.usertype})`);
    console.log(`tttt: ${token} (${cookieOptions})`);

    // Set secure HTTP-only cookie and return response
    return res
      .cookie("token", token, cookieOptions)
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        user: {
          id: userData.id,
          fname: userData.fname,
          usertype: userData.usertype,
        },
      });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      error: "Authentication failed",
    });
  }
};

export { login, loginLimiter };
