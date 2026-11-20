import mongoose from "mongoose";

import firebaseDB from "../config/firebase.js";
import User from "../models/User.js";

const dishesRef = firebaseDB.ref("Dishes");

// Validate Firebase Realtime Database keys.
const isValidDishId = (id) =>
  typeof id === "string" &&
  id.length > 0 &&
  id.length <= 768 &&
  !/[.#$\[\]/]/.test(id);

// Return a consistent dish object.
const formatDish = (id, dish) => ({
  id,
  ...dish,
});

// Create a dish.
export const createDish = async (req, res) => {
  try {
    const { dishName, items, isPublic } = req.body;

    if (
      typeof dishName !== "string" ||
      !dishName.trim() ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        message: "Valid dish name and items are required",
      });
    }

    // Validate individual dish items
    const invalidItems = items.some(
      (item) =>
        !item ||
        typeof item !== "object" ||
        Array.isArray(item) ||
        typeof item.name !== "string" ||
        !item.name.trim() ||
        typeof item.quantity !== "string" ||
        !item.quantity.trim() ||
        typeof item.calories !== "number" ||
        !Number.isFinite(item.calories) ||
        item.calories < 0,
    );

    if (invalidItems) {
      return res.status(400).json({
        message: "Each item must have a valid name, quantity, and calories",
      });
    }

    if (isPublic !== undefined && typeof isPublic !== "boolean") {
      return res.status(400).json({
        message: "isPublic must be a boolean",
      });
    }

    const newDish = {
      dishName: dishName.trim(),
      ownerId: req.user.userId,
      isPublic: isPublic ?? false,
      sharedWith: [],
      items,
    };

    const newDishRef = dishesRef.push();

    await newDishRef.set(newDish);

    return res.status(201).json({
      message: "Dish created successfully",
      dish: formatDish(newDishRef.key, newDish),
    });
  } catch (error) {
    console.error("Create dish error:", error);

    return res.status(500).json({
      message: "Failed to create dish",
    });
  }
};

// Get all public dishes (public page).
export const getPublicDishes = async (req, res) => {
  try {
    const snapshot = await dishesRef.once("value");
    const data = snapshot.val() || {};

    const dishes = Object.entries(data)
      .filter(([, dish]) => dish.isPublic === true)
      .map(([id, dish]) => formatDish(id, dish));

    return res.status(200).json(dishes);
  } catch (error) {
    console.error("Get public dishes error:", error);

    return res.status(500).json({
      message: "Failed to fetch public dishes",
    });
  }
};

// Get dishes accessible to the logged-in user.
export const getDishes = async (req, res) => {
  try {
    const snapshot = await dishesRef.once("value");
    const data = snapshot.val() || {};

    const dishes = Object.entries(data)
      .filter(([, dish]) => {
        const isOwner = dish.ownerId === req.user.userId;

        const isShared =
          Array.isArray(dish.sharedWith) &&
          dish.sharedWith.some(
            (sharedUserId) =>
              typeof sharedUserId === "string" &&
              sharedUserId.toLowerCase() === req.user.userId.toLowerCase(),
          );

        return dish.isPublic === true || isOwner || isShared;
      })
      .map(([id, dish]) => formatDish(id, dish));

    return res.status(200).json(dishes);
  } catch (error) {
    console.error("Get dishes error:", error);

    return res.status(500).json({
      message: "Failed to fetch dishes",
    });
  }
};

// Get an individual dish through its QR code.
export const getDishById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidDishId(id)) {
      return res.status(404).json({
        message: "Dish not found",
      });
    }

    const snapshot = await dishesRef.child(id).once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({
        message: "Dish not found",
      });
    }

    const dish = snapshot.val();

    const isOwner = dish.ownerId === req.user.userId;

    const isShared =
      Array.isArray(dish.sharedWith) &&
      dish.sharedWith.some(
        (sharedUserId) =>
          typeof sharedUserId === "string" &&
          sharedUserId.toLowerCase() === req.user.userId.toLowerCase(),
      );

    const canAccess = dish.isPublic === true || isOwner || isShared;

    if (!canAccess) {
      return res.status(404).json({
        message: "Dish not found",
      });
    }

    return res.status(200).json(formatDish(id, dish));
  } catch (error) {
    console.error("Get dish error:", error);

    return res.status(500).json({
      message: "Failed to fetch dish",
    });
  }
};

// Update a dish (owner only).
export const updateDish = async (req, res) => {
  try {
    const { id } = req.params;
    const { dishName, items, isPublic } = req.body;

    if (!isValidDishId(id)) {
      return res.status(404).json({
        message: "Dish not found",
      });
    }

    const dishRef = dishesRef.child(id);
    const snapshot = await dishRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({
        message: "Dish not found",
      });
    }

    const dish = snapshot.val();

    if (dish.ownerId !== req.user.userId) {
      return res.status(403).json({
        message: "Only the dish owner can update it",
      });
    }

    if (
      Object.hasOwn(req.body, "ownerId") ||
      Object.hasOwn(req.body, "sharedWith")
    ) {
      return res.status(400).json({
        message: "ownerId and sharedWith cannot be modified",
      });
    }

    if (
      dishName !== undefined &&
      (typeof dishName !== "string" || !dishName.trim())
    ) {
      return res.status(400).json({
        message: "Invalid dish name",
      });
    }

    if (items !== undefined) {
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          message: "Items must be a non-empty array",
        });
      }

      const invalidItems = items.some(
        (item) =>
          !item ||
          typeof item !== "object" ||
          Array.isArray(item) ||
          typeof item.name !== "string" ||
          !item.name.trim() ||
          typeof item.quantity !== "string" ||
          !item.quantity.trim() ||
          typeof item.calories !== "number" ||
          !Number.isFinite(item.calories) ||
          item.calories < 0,
      );

      if (invalidItems) {
        return res.status(400).json({
          message: "Each item must have a valid name, quantity, and calories",
        });
      }
    }

    if (isPublic !== undefined && typeof isPublic !== "boolean") {
      return res.status(400).json({
        message: "isPublic must be a boolean",
      });
    }

    const updates = {};

    if (dishName !== undefined) {
      updates.dishName = dishName.trim();
    }

    if (items !== undefined) {
      updates.items = items;
    }

    if (isPublic !== undefined) {
      updates.isPublic = isPublic;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "At least one valid field is required",
      });
    }

    await dishRef.update(updates);

    const updatedSnapshot = await dishRef.once("value");

    return res.status(200).json({
      message: "Dish updated successfully",
      dish: formatDish(id, updatedSnapshot.val()),
    });
  } catch (error) {
    console.error("Update dish error:", error);

    return res.status(500).json({
      message: "Failed to update dish",
    });
  }
};

// Delete a dish (owner only).
export const deleteDish = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidDishId(id)) {
      return res.status(404).json({
        message: "Dish not found",
      });
    }

    const dishRef = dishesRef.child(id);
    const snapshot = await dishRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({
        message: "Dish not found",
      });
    }

    if (snapshot.val().ownerId !== req.user.userId) {
      return res.status(403).json({
        message: "Only the dish owner can delete it",
      });
    }

    await dishRef.remove();

    return res.status(200).json({
      message: "Dish deleted successfully",
    });
  } catch (error) {
    console.error("Delete dish error:", error);

    return res.status(500).json({
      message: "Failed to delete dish",
    });
  }
};

// Share a dish with a registered user (owner only).
export const shareDish = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    if (!isValidDishId(id)) {
      return res.status(404).json({
        message: "Dish not found",
      });
    }

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        message: "Recipient email is required",
      });
    }

    const dishRef = dishesRef.child(id);
    const snapshot = await dishRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({
        message: "Dish not found",
      });
    }

    const dish = snapshot.val();

    if (dish.ownerId !== req.user.userId) {
      return res.status(403).json({
        message: "Only the dish owner can share it",
      });
    }

    const recipient = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!recipient) {
      return res.status(404).json({
        message: "Registered recipient not found",
      });
    }

    const recipientId = recipient._id.toString();

    if (recipientId === req.user.userId) {
      return res.status(400).json({
        message: "You already own this dish",
      });
    }

    let alreadyShared = false;
    let ownerChanged = false;

    const result = await dishRef.transaction((currentDish) => {
      if (currentDish === null) {
        return currentDish;
      }

      if (currentDish.ownerId !== req.user.userId) {
        ownerChanged = true;
        return;
      }

      const sharedWith = Array.isArray(currentDish.sharedWith)
        ? currentDish.sharedWith
        : [];

      if (sharedWith.includes(recipientId)) {
        alreadyShared = true;
        return;
      }

      return {
        ...currentDish,
        sharedWith: [...sharedWith, recipientId],
      };
    });

    if (ownerChanged) {
      return res.status(403).json({
        message: "Only the dish owner can share it",
      });
    }

    if (alreadyShared) {
      return res.status(409).json({
        message: "Dish is already shared with this user",
      });
    }

    if (!result.committed) {
      return res.status(404).json({
        message: "Dish could not be shared",
      });
    }

    return res.status(200).json({
      message: "Dish shared successfully",
    });
  } catch (error) {
    console.error("Share dish error:", error);

    return res.status(500).json({
      message: "Failed to share dish",
    });
  }
};

// Revoke a user's access (owner only).
export const unshareDish = async (req, res) => {
  try {
    const { id, userId } = req.params;

    if (!isValidDishId(id)) {
      return res.status(404).json({
        message: "Dish not found",
      });
    }

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const dishRef = dishesRef.child(id);

    let ownerChanged = false;
    let userWasShared = false;

    const result = await dishRef.transaction((dish) => {
      if (dish === null) return dish;

      if (dish.ownerId !== req.user.userId) {
        ownerChanged = true;
        return;
      }

      const sharedWith = Array.isArray(dish.sharedWith) ? dish.sharedWith : [];

      userWasShared = sharedWith.some(
        (sharedUserId) => sharedUserId.toLowerCase() === userId.toLowerCase(),
      );

      if (!userWasShared) return;

      return {
        ...dish,
        sharedWith: sharedWith.filter(
          (sharedUserId) => sharedUserId.toLowerCase() !== userId.toLowerCase(),
        ),
      };
    });

    if (ownerChanged) {
      return res.status(403).json({
        message: "Only the dish owner can manage sharing",
      });
    }

    if (!result.committed) {
      return res.status(404).json({
        message: "User does not have access to this dish",
      });
    }

    return res.status(200).json({
      message: "Dish access revoked successfully",
    });
  } catch (error) {
    console.error("Unshare dish error:", error);

    return res.status(500).json({
      message: "Failed to revoke dish access",
    });
  }
};
