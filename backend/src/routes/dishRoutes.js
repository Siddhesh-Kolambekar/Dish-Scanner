import express from "express";

import {
  createDish,
  getPublicDishes,
  getDishes,
  getDishById,
  updateDish,
  deleteDish,
  shareDish,
  unshareDish,
} from "../controllers/dishController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public page: list dishes marked as public.
router.get("/public", getPublicDishes);

// Authenticated user's accessible dishes.
router.get("/", authMiddleware, getDishes);

// Create a dish.
router.post("/", authMiddleware, createDish);

// View a dish through QR code (login required).
router.get("/:id", authMiddleware, getDishById);

// Update a dish (owner only).
router.put("/:id", authMiddleware, updateDish);

// Delete a dish (owner only).
router.delete("/:id", authMiddleware, deleteDish);

// Share a dish with a registered user.
router.post("/:id/share", authMiddleware, shareDish);

// Revoke a user's access.
router.delete("/:id/share/:userId", authMiddleware, unshareDish);

export default router;
