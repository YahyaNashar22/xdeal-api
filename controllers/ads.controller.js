import mongoose from "mongoose";
import Ads from "../models/ads.model.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Create Ad
 */
export const createAd = async (req, res) => {
  try {
    const { title, image } = req.body;

    if (!title || !image) {
      return res.status(400).json({ message: "Title and image are required" });
    }

    const ad = await Ads.create({ title, image });

    return res.status(201).json(ad);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to create ad",
      error: err.message,
    });
  }
};

/**
 * Get all Ads (with pagination)
 */
export const getAds = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const p = Math.max(parseInt(page, 10) || 1, 1);
    const l = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const skip = (p - 1) * l;

    const [items, total] = await Promise.all([
      Ads.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(l),
      Ads.countDocuments(),
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
      message: "Failed to fetch ads",
      error: err.message,
    });
  }
};

/**
 * Get Ad by ID
 */
export const getAdById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const ad = await Ads.findById(id);

    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    return res.json(ad);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch ad",
      error: err.message,
    });
  }
};

/**
 * Update Ad
 */
export const updateAd = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const patch = {};
    if (req.body.title !== undefined) patch.title = req.body.title;
    if (req.body.image !== undefined) patch.image = req.body.image;

    const updated = await Ads.findByIdAndUpdate(id, patch, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Ad not found" });
    }

    return res.json(updated);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to update ad",
      error: err.message,
    });
  }
};

/**
 * Delete Ad
 */
export const deleteAd = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const deleted = await Ads.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Ad not found" });
    }

    return res.json({ message: "Ad deleted" });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to delete ad",
      error: err.message,
    });
  }
};