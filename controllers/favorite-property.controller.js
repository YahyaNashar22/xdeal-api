import mongoose from "mongoose";
import FavoriteProperty from "../models/favoriteProperty.model.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Add property to favorites
 */
export const addFavoriteProperty = async (req, res) => {
    try {
        const { user_id, property_id } = req.body;

        if (!isValidObjectId(user_id) || !isValidObjectId(property_id)) {
            return res.status(400).json({ message: "Invalid user_id or property_id" });
        }

        const favorite = await FavoriteProperty.create({
            user_id,
            property_id,
        });

        return res.status(201).json(favorite);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: "Already in favorites" });
        }

        return res.status(500).json({
            message: "Failed to add favorite",
            error: err.message,
        });
    }
};

/**
 * Remove property from favorites
 */
export const removeFavoriteProperty = async (req, res) => {
    try {
        const { user_id, property_id } = req.body;

        if (!isValidObjectId(user_id) || !isValidObjectId(property_id)) {
            return res.status(400).json({ message: "Invalid user_id or property_id" });
        }

        const deleted = await FavoriteProperty.findOneAndDelete({
            user_id,
            property_id,
        });

        if (!deleted) {
            return res.status(404).json({ message: "Favorite not found" });
        }

        return res.json({ message: "Removed from favorites" });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to remove favorite",
            error: err.message,
        });
    }
};

/**
 * Toggle favorite
 */
export const toggleFavoriteProperty = async (req, res) => {
    try {
        const { user_id, property_id } = req.body;

        if (!isValidObjectId(user_id) || !isValidObjectId(property_id)) {
            return res.status(400).json({ message: "Invalid user_id or property_id" });
        }

        const existing = await FavoriteProperty.findOne({
            user_id,
            property_id,
        });

        if (existing) {
            await existing.deleteOne();
            return res.json({ isFavorited: false });
        }

        await FavoriteProperty.create({ user_id, property_id });
        return res.json({ isFavorited: true });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to toggle favorite",
            error: err.message,
        });
    }
};

/**
 * Get all favorite properties of a user
 */
export const getUserFavoriteProperties = async (req, res) => {
    try {
        const { user_id } = req.params;

        if (!isValidObjectId(user_id)) {
            return res.status(400).json({ message: "Invalid user_id" });
        }

        const favorites = await FavoriteProperty.find({ user_id })
            .populate({
                path: "property_id",
                populate: [
                    { path: "category", select: "title" },
                    { path: "user_id", select: "name email" },
                ],
            })
            .sort({ createdAt: -1 });

        const properties = favorites.map((f) => f.property_id);

        return res.json({
            items: properties,
            total: properties.length,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to fetch favorites",
            error: err.message,
        });
    }
};

/**
 * Check if property is favorited
 */
export const checkFavoriteProperty = async (req, res) => {
    try {
        const { user_id, property_id } = req.query;

        if (!isValidObjectId(user_id) || !isValidObjectId(property_id)) {
            return res.status(400).json({ message: "Invalid user_id or property_id" });
        }

        const exists = await FavoriteProperty.exists({
            user_id,
            property_id,
        });

        return res.json({ isFavorited: !!exists });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to check favorite",
            error: err.message,
        });
    }
};