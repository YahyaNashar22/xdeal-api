import mongoose from "mongoose";
import PropertyCategories from "../models/propertyCategories.model.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const createPropertyCategory = async (req, res) => {
    try {
        const title = String(req.body?.title ?? "").trim();
        if (!title) return res.status(400).json({ message: "title is required" });

        // optional: prevent duplicates (case-insensitive)
        const exists = await PropertyCategories.findOne({
            title: { $regex: `^${escapeRegex(title)}$`, $options: "i" },
        });
        if (exists) return res.status(409).json({ message: "Category already exists" });

        const doc = await PropertyCategories.create({ title });
        return res.status(201).json(doc);
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err?.message });
    }
};

export const getPropertyCategories = async (req, res) => {
    try {
        const q = String(req.query?.q ?? "").trim();
        const page = Math.max(parseInt(String(req.query?.page ?? "1"), 10) || 1, 1);
        const limit = Math.min(
            Math.max(parseInt(String(req.query?.limit ?? "20"), 10) || 20, 1),
            100
        );
        const skip = (page - 1) * limit;

        const filter = q
            ? { title: { $regex: escapeRegex(q), $options: "i" } }
            : {};

        const [items, total] = await Promise.all([
            PropertyCategories.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
            PropertyCategories.countDocuments(filter),
        ]);

        return res.json({ items, total, page, limit });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err?.message });
    }
};

export const getPropertyCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });

        const doc = await PropertyCategories.findById(id);
        if (!doc) return res.status(404).json({ message: "Not found" });

        return res.json(doc);
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err?.message });
    }
};

export const updatePropertyCategory = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });

        const title = String(req.body?.title ?? "").trim();
        if (!title) return res.status(400).json({ message: "title is required" });

        // optional: prevent duplicates (case-insensitive) excluding same id
        const exists = await PropertyCategories.findOne({
            _id: { $ne: id },
            title: { $regex: `^${escapeRegex(title)}$`, $options: "i" },
        });
        if (exists) return res.status(409).json({ message: "Category already exists" });

        const updated = await PropertyCategories.findByIdAndUpdate(
            id,
            { title },
            { new: true, runValidators: true }
        );

        if (!updated) return res.status(404).json({ message: "Not found" });
        return res.json(updated);
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err?.message });
    }
};

export const deletePropertyCategory = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });

        const deleted = await PropertyCategories.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Not found" });

        return res.json({ message: "Deleted", id });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err?.message });
    }
};