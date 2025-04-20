const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to authenticate user
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user exists
    const user = await User.findById(decoded.id).select("-password");
    if (!user || !user.active) {
      return res.status(401).json({ message: "User not found or inactive" });
    }

    req.user = {
      id: user._id,
      role: user.role,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Middleware to check if user is admin
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Access denied: Admin role required" });
  }
  next();
};

// Middleware to check if user is admin or manager
const managerMiddleware = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "manager") {
    return res
      .status(403)
      .json({ message: "Access denied: Admin or Manager role required" });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware, managerMiddleware };
