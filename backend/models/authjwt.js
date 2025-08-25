// authjwt.js
import jwt from "jsonwebtoken";
const { verify } = jwt;

// Authentication Middleware
const authenticateUser = (req, res, next) => {
  try {
    // 1. Get token from multiple possible locations
    const token =
      req.cookies?.token ||
      req.headers?.authorization?.split(" ")[1] ||
      req.query?.token;

    if (!token) {
      console.log("No token found in:", {
        cookies: req.cookies,
        headers: req.headers,
        query: req.query,
      });
      return res.status(401).json({ error: "Authentication token required" });
    }

    // 2. Verify token
    const decoded = verify(token, "pppppppp");

    // 3. Attach user to request
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res.status(401).json({
      error: "Invalid or expired token",
      ...(process.env.NODE_ENV === "development" && { details: error.message }),
    });
  }
};

// Authorization Middleware
const authorizeUpdate = (req, res, next) => {
  const requestedUserId = req.params.id;
  const requestingUser = req.user;

  // 1. Admins can update any user
  if (requestingUser.role === "admin") {
    return next();
  }

  // 2. Regular users can only update themselves
  if (requestedUserId === requestingUser.id) {
    return next();
  }

  // 3. Deny all other cases
  return res.status(403).json({ error: "Unauthorized to update this user" });
};

export { authenticateUser, authorizeUpdate };
