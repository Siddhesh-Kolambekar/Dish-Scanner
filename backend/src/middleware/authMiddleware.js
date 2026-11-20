import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const verifyToken = (token) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (
    !decoded ||
    typeof decoded.userId !== "string" ||
    !mongoose.isValidObjectId(decoded.userId)
  ) {
    throw new Error("Invalid token payload");
  }

  return decoded;
};

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const token = authHeader.slice(7).trim();

    if (!token || token.split(/\s+/).length !== 1) {
      return res.status(401).json({
        message: "Invalid authorization format",
      });
    }

    req.user = verifyToken(token);

    next();
  } catch (error) {
    if (error.message === "JWT_SECRET is not configured") {
      console.error(error.message);

      return res.status(500).json({
        message: "Authentication service unavailable",
      });
    }

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

export const optionalAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next();
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Invalid authorization format",
      });
    }

    const token = authHeader.slice(7).trim();

    if (!token || token.split(/\s+/).length !== 1) {
      return res.status(401).json({
        message: "Invalid authorization format",
      });
    }

    req.user = verifyToken(token);

    next();
  } catch (error) {
    if (error.message === "JWT_SECRET is not configured") {
      console.error(error.message);

      return res.status(500).json({
        message: "Authentication service unavailable",
      });
    }

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
