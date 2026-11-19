import "dotenv/config";

import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

const app = express();

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Middleware
app.use(express.json());

// Routes
app.use("/api", authRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Dish Scanner API is running",
  });
});

export default app;
