import mongoose from "mongoose";
import Notification from "../models/notification.model.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const pick = (obj, keys) =>
  keys.reduce((acc, k) => {
    if (obj[k] !== undefined) acc[k] = obj[k];
    return acc;
  }, {});

/**
 * Create Notification
 */
export const createNotification = async (req, res) => {
  try {
    const { title, description, user_id } = req.body;

    if (!title || !user_id) {
      return res.status(400).json({ message: "title and user_id are required" });
    }
    if (!isValidObjectId(user_id)) {
      return res.status(400).json({ message: "Invalid user_id" });
    }

    const created = await Notification.create({
      title,
      description,
      user_id,
    });

    await created.populate("user_id", "name email");

    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to create notification",
      error: err.message,
    });
  }
};

/**
 * Get Notifications (optionally by user_id)
 * Supports pagination.
 */
export const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, user_id } = req.query;

    const p = Math.max(parseInt(page, 10) || 1, 1);
    const l = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const skip = (p - 1) * l;

    const filter = {};
    if (user_id) {
      if (!isValidObjectId(user_id)) {
        return res.status(400).json({ message: "Invalid user_id" });
      }
      filter.user_id = user_id;
    }

    const [items, total] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(l)
        .populate("user_id", "name email"),
      Notification.countDocuments(filter),
    ]);

    return res.json({
      items,
      page: p,
      limit: l,
      total,
      pages: Math.ceil(total / l),
      hasMore: p * l < total,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch notifications",
      error: err.message,
    });
  }
};

/**
 * Get Notification by ID
 */
export const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const item = await Notification.findById(id).populate(
      "user_id",
      "name email",
    );

    if (!item) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.json(item);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch notification",
      error: err.message,
    });
  }
};

/**
 * Update Notification
 */
export const updateNotification = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const patch = pick(req.body, ["title", "description", "user_id"]);

    if (patch.user_id !== undefined && !isValidObjectId(patch.user_id)) {
      return res.status(400).json({ message: "Invalid user_id" });
    }

    const updated = await Notification.findByIdAndUpdate(id, patch, {
      new: true,
      runValidators: true,
    }).populate("user_id", "name email");

    if (!updated) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.json(updated);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to update notification",
      error: err.message,
    });
  }
};

/**
 * Delete Notification
 */
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const deleted = await Notification.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.json({ message: "Notification deleted" });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to delete notification",
      error: err.message,
    });
  }
};