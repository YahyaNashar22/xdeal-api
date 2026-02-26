import mongoose from "mongoose";
import PropertyListing from "../models/propertyListing.model.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const pick = (obj, keys) =>
    keys.reduce((acc, k) => {
        if (obj[k] !== undefined) acc[k] = obj[k];
        return acc;
    }, {});

export const createPropertyListing = async (req, res) => {
    try {
        const payload = pick(req.body, [
            "name",
            "images",
            "three_sixty",
            "price",
            "description",
            "category",
            "coords",
            "bedrooms",
            "bathrooms",
            "extra_features",
            "is_featured",
            "is_sponsored",
            "is_listed",
            "on_sale",
            "is_rent",
            "number_of_views",
            "agent_type",
            "rental_payment",
            "user_id",
        ]);

        const created = await PropertyListing.create(payload);

        // return populated (optional but recommended)
        await created.populate("category", "title");
        await created.populate("user_id", "name email");

        return res.status(201).json(created);
    } catch (err) {
        return res.status(400).json({
            message: "Failed to create property listing",
            error: err?.message ?? String(err),
        });
    }
};

export const getPropertyListings = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            q,
            category,
            user_id,
            is_featured,
            is_sponsored,
            is_listed,
            on_sale,
            is_rent,
            agent_type,
            bedrooms_min,
            bedrooms_max,
            bathrooms_min,
            bathrooms_max,
            sortBy = "createdAt",
            sortDir = "desc",
        } = req.query;

        const p = Math.max(parseInt(page, 10) || 1, 1);
        const l = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
        const skip = (p - 1) * l;

        const filter = {};

        if (q && String(q).trim()) {
            const s = String(q).trim();
            filter.$or = [
                { name: { $regex: s, $options: "i" } },
                { description: { $regex: s, $options: "i" } },
            ];
        }

        if (category && isValidObjectId(category)) filter.category = category;
        if (user_id && isValidObjectId(user_id)) filter.user_id = user_id;

        if (is_featured !== undefined) filter.is_featured = String(is_featured) === "true";
        if (is_sponsored !== undefined) filter.is_sponsored = String(is_sponsored) === "true";
        if (is_listed !== undefined) filter.is_listed = String(is_listed) === "true";
        if (on_sale !== undefined) filter.on_sale = String(on_sale) === "true";
        if (is_rent !== undefined) filter.is_rent = String(is_rent) === "true";

        if (agent_type && ["owner", "middleman"].includes(String(agent_type))) {
            filter.agent_type = String(agent_type);
        }

        // numeric ranges
        const bMin = bedrooms_min !== undefined ? Number(bedrooms_min) : null;
        const bMax = bedrooms_max !== undefined ? Number(bedrooms_max) : null;
        if (!Number.isNaN(bMin) && bMin !== null) filter.bedrooms = { ...(filter.bedrooms || {}), $gte: bMin };
        if (!Number.isNaN(bMax) && bMax !== null) filter.bedrooms = { ...(filter.bedrooms || {}), $lte: bMax };

        const baMin = bathrooms_min !== undefined ? Number(bathrooms_min) : null;
        const baMax = bathrooms_max !== undefined ? Number(bathrooms_max) : null;
        if (!Number.isNaN(baMin) && baMin !== null) filter.bathrooms = { ...(filter.bathrooms || {}), $gte: baMin };
        if (!Number.isNaN(baMax) && baMax !== null) filter.bathrooms = { ...(filter.bathrooms || {}), $lte: baMax };

        const allowedSort = new Set(["createdAt", "updatedAt", "number_of_views", "bedrooms", "bathrooms"]);
        const sortField = allowedSort.has(String(sortBy)) ? String(sortBy) : "createdAt";
        const sortOrder = String(sortDir).toLowerCase() === "asc" ? 1 : -1;

        const [items, total] = await Promise.all([
            PropertyListing.find(filter)
                .sort({ [sortField]: sortOrder })
                .skip(skip)
                .limit(l)
                .populate("category", "title")
                .populate("user_id", "name email"),
            PropertyListing.countDocuments(filter),
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
            message: "Failed to fetch property listings",
            error: err?.message ?? String(err),
        });
    }
};

export const getPropertyListingById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });

        const item = await PropertyListing.findById(id)
            .populate("category", "title")
            .populate("user_id", "name email");

        if (!item) return res.status(404).json({ message: "Property listing not found" });

        return res.json(item);
    } catch (err) {
        return res.status(500).json({
            message: "Failed to fetch property listing",
            error: err?.message ?? String(err),
        });
    }
};

export const updatePropertyListing = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });

        const patch = pick(req.body, [
            "name",
            "images",
            "three_sixty",
            "price",
            "description",
            "category",
            "coords",
            "bedrooms",
            "bathrooms",
            "extra_features",
            "is_featured",
            "is_sponsored",
            "is_listed",
            "on_sale",
            "is_rent",
            "agent_type",
            "rental_payment",
            "user_id",
        ]);

        const updated = await PropertyListing.findByIdAndUpdate(id, patch, {
            new: true,
            runValidators: true,
        })
            .populate("category", "title")
            .populate("user_id", "name email");

        if (!updated) return res.status(404).json({ message: "Property listing not found" });

        return res.json(updated);
    } catch (err) {
        return res.status(400).json({
            message: "Failed to update property listing",
            error: err?.message ?? String(err),
        });
    }
};

export const deletePropertyListing = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });

        const deleted = await PropertyListing.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Property listing not found" });

        return res.json({ message: "Property listing deleted" });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to delete property listing",
            error: err?.message ?? String(err),
        });
    }
};

export const incrementPropertyListingViews = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });

        const updated = await PropertyListing.findByIdAndUpdate(
            id,
            { $inc: { number_of_views: 1 } },
            { new: true }
        )
            .populate("category", "title")
            .populate("user_id", "name email");

        if (!updated) return res.status(404).json({ message: "Property listing not found" });

        return res.json(updated);
    } catch (err) {
        return res.status(500).json({
            message: "Failed to increment views",
            error: err?.message ?? String(err),
        });
    }
};