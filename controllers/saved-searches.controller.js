import mongoose from "mongoose";
import SavedSearches from "../models/savedSearches.model.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Create / Save Search
 */
export const createSavedSearch = async (req, res) => {
  try {
    const { user_id, search_term } = req.body;

    if (!user_id || !search_term) {
      return res.status(400).json({
        message: "user_id and search_term are required",
      });
    }

    if (!isValidObjectId(user_id)) {
      return res.status(400).json({ message: "Invalid user_id" });
    }

    const saved = await SavedSearches.create({
      user_id,
      search_term: search_term.trim(),
    });

    return res.status(201).json(saved);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to save search",
      error: err.message,
    });
  }
};

/**
 * Get Saved Searches (by user)
 */
export const getSavedSearches = async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    if (!isValidObjectId(user_id)) {
      return res.status(400).json({ message: "Invalid user_id" });
    }

    const searches = await SavedSearches.find({ user_id })
      .sort({ createdAt: -1 });

    return res.json({
      items: searches,
      total: searches.length,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch saved searches",
      error: err.message,
    });
  }
};

/**
 * Delete single saved search
 */
export const deleteSavedSearch = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const deleted = await SavedSearches.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Saved search not found" });
    }

    return res.json({ message: "Saved search deleted" });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to delete saved search",
      error: err.message,
    });
  }
};

/**
 * Clear all saved searches for a user
 */
export const clearSavedSearches = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!isValidObjectId(user_id)) {
      return res.status(400).json({ message: "Invalid user_id" });
    }

    await SavedSearches.deleteMany({ user_id });

    return res.json({ message: "All saved searches cleared" });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to clear saved searches",
      error: err.message,
    });
  }
};