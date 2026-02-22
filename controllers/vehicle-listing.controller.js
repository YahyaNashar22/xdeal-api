// src/controllers/vehicle-listings.controller.js
import mongoose from "mongoose";
import VehicleListing from "../models/vehicleListing.model.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const parseBool = (v) => {
    if (v === true || v === false) return v;
    if (v == null) return undefined;
    const s = String(v).toLowerCase().trim();
    if (["true", "1", "yes"].includes(s)) return true;
    if (["false", "0", "no"].includes(s)) return false;
    return undefined;
};

const parseNumber = (v) => {
    if (v == null || v === "") return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
};

const pickListingBody = (body) => {
    // keep this in sync with schema
    const data = {
        name: body?.name,
        images: body?.images,
        price: body?.price,
        description: body?.description,
        category: body?.category,
        coords: body?.coords,
        brand: body?.brand,
        model: body?.model,
        version: body?.version,
        condition: body?.condition,
        kilometers: body?.kilometers,
        year: body?.year,
        fuel_type: body?.fuel_type,
        transmission_type: body?.transmission_type,
        body_type: body?.body_type,
        power: body?.power,
        consumption: body?.consumption,
        air_conditioning: body?.air_conditioning,
        color: body?.color,
        number_of_seats: body?.number_of_seats,
        number_of_doors: body?.number_of_doors,
        interior: body?.interior,
        payment_option: body?.payment_option,
        extra_features: body?.extra_features,
        is_featured: body?.is_featured,
        is_sponsored: body?.is_sponsored,
        is_listed: body?.is_listed,
        on_sale: body?.on_sale,
        number_of_views: body?.number_of_views,
        user_id: body?.user_id,
    };

    // normalize
    if (typeof data.name === "string") data.name = data.name.trim();
    if (typeof data.price === "string") data.price = data.price.trim();
    if (typeof data.description === "string") data.description = data.description.trim();
    if (typeof data.brand === "string") data.brand = data.brand.trim();
    if (typeof data.model === "string") data.model = data.model.trim();
    if (typeof data.version === "string") data.version = data.version.trim();
    if (typeof data.year === "string") data.year = data.year.trim();
    if (typeof data.color === "string") data.color = data.color.trim();

    // allow coords as ["33.8","35.5"] etc.
    if (Array.isArray(data.coords)) {
        data.coords = data.coords.map((x) => Number(x));
    }

    // coerce booleans if coming from query/forms
    const boolFields = ["is_featured", "is_sponsored", "is_listed", "on_sale"];
    for (const f of boolFields) {
        const b = parseBool(data[f]);
        if (b !== undefined) data[f] = b;
    }

    // coerce numbers
    const numFields = [
        "kilometers",
        "power",
        "consumption",
        "number_of_seats",
        "number_of_doors",
        "number_of_views",
    ];
    for (const f of numFields) {
        const n = parseNumber(data[f]);
        if (n !== undefined) data[f] = n;
    }

    return data;
};

export const createVehicleListing = async (req, res) => {
    try {
        const data = pickListingBody(req.body);

        // Minimal extra validations (mongoose will validate too)
        if (!data.name) return res.status(400).json({ message: "name is required" });
        if (!Array.isArray(data.images)) return res.status(400).json({ message: "images must be an array" });
        if (!data.price) return res.status(400).json({ message: "price is required" });
        if (!data.description) return res.status(400).json({ message: "description is required" });
        if (!data.category || !isValidObjectId(String(data.category)))
            return res.status(400).json({ message: "category is invalid" });
        if (!Array.isArray(data.coords) || data.coords.length !== 2 || data.coords.some((n) => !Number.isFinite(n)))
            return res.status(400).json({ message: "coords must be [lat,lng] numbers" });
        if (!data.user_id || !isValidObjectId(String(data.user_id)))
            return res.status(400).json({ message: "user_id is invalid" });

        const doc = await VehicleListing.create(data);
        return res.status(201).json(doc);
    } catch (err) {
        // Mongoose validation errors
        if (err?.name === "ValidationError") {
            return res.status(400).json({ message: "Validation error", errors: err.errors });
        }
        return res.status(500).json({ message: "Server error", error: err?.message });
    }
};

export const getVehicleListings = async (req, res) => {
    try {
        // Pagination
        const page = Math.max(parseInt(String(req.query?.page ?? "1"), 10) || 1, 1);
        const limit = Math.min(Math.max(parseInt(String(req.query?.limit ?? "20"), 10) || 20, 1), 100);
        const skip = (page - 1) * limit;

        // Filters
        const q = String(req.query?.q ?? "").trim();
        const category = String(req.query?.category ?? "").trim();
        const userId = String(req.query?.user_id ?? "").trim();

        const isFeatured = parseBool(req.query?.is_featured);
        const isSponsored = parseBool(req.query?.is_sponsored);
        const isListed = parseBool(req.query?.is_listed);
        const onSale = parseBool(req.query?.on_sale);

        const condition = String(req.query?.condition ?? "").trim(); // new/used
        const brand = String(req.query?.brand ?? "").trim();
        const model = String(req.query?.model ?? "").trim();
        const fuelType = String(req.query?.fuel_type ?? "").trim();
        const transmissionType = String(req.query?.transmission_type ?? "").trim();
        const bodyType = String(req.query?.body_type ?? "").trim();
        const paymentOption = String(req.query?.payment_option ?? "").trim();

        const yearMin = parseNumber(req.query?.year_min);
        const yearMax = parseNumber(req.query?.year_max);
        const kmMin = parseNumber(req.query?.km_min);
        const kmMax = parseNumber(req.query?.km_max);

        const filter = {};

        if (q) {
            // basic text search across a few fields
            const r = { $regex: escapeRegex(q), $options: "i" };
            filter.$or = [{ name: r }, { description: r }, { brand: r }, { model: r }, { color: r }];
        }

        if (category) {
            if (!isValidObjectId(category)) return res.status(400).json({ message: "Invalid category id" });
            filter.category = category;
        }

        if (userId) {
            if (!isValidObjectId(userId)) return res.status(400).json({ message: "Invalid user_id" });
            filter.user_id = userId;
        }

        if (isFeatured !== undefined) filter.is_featured = isFeatured;
        if (isSponsored !== undefined) filter.is_sponsored = isSponsored;
        if (isListed !== undefined) filter.is_listed = isListed;
        if (onSale !== undefined) filter.on_sale = onSale;

        if (condition) filter.condition = condition;
        if (brand) filter.brand = { $regex: `^${escapeRegex(brand)}$`, $options: "i" };
        if (model) filter.model = { $regex: `^${escapeRegex(model)}$`, $options: "i" };
        if (fuelType) filter.fuel_type = fuelType;
        if (transmissionType) filter.transmission_type = transmissionType;
        if (bodyType) filter.body_type = bodyType;
        if (paymentOption) filter.payment_option = paymentOption;

        // year stored as string; handle numeric comparisons by converting to int-like values
        if (yearMin !== undefined || yearMax !== undefined) {
            // works only if years are 4-digit numeric strings
            filter.year = {};
            if (yearMin !== undefined) filter.year.$gte = String(yearMin);
            if (yearMax !== undefined) filter.year.$lte = String(yearMax);
        }

        if (kmMin !== undefined || kmMax !== undefined) {
            filter.kilometers = {};
            if (kmMin !== undefined) filter.kilometers.$gte = kmMin;
            if (kmMax !== undefined) filter.kilometers.$lte = kmMax;
        }

        // Sorting
        const sortBy = String(req.query?.sortBy ?? "createdAt");
        const sortDir = String(req.query?.sortDir ?? "desc").toLowerCase() === "asc" ? 1 : -1;
        const sort = { [sortBy]: sortDir };

        const [items, total] = await Promise.all([
            VehicleListing.find(filter)
                .populate("category", "title")
                .populate("user_id") // adjust fields
                .sort(sort)
                .skip(skip)
                .limit(limit),
            VehicleListing.countDocuments(filter),
        ]);

        return res.json({ items, total, page, limit });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err?.message });
    }
};

export const getVehicleListingById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });

        const doc = await VehicleListing.findById(id)
            .populate("category", "title")
            .populate("user_id");
        if (!doc) return res.status(404).json({ message: "Not found" });

        return res.json(doc);
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err?.message });
    }
};

export const updateVehicleListing = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });

        const data = pickListingBody(req.body);

        // If category/user_id provided, validate ids
        if (data.category && !isValidObjectId(String(data.category)))
            return res.status(400).json({ message: "category is invalid" });
        if (data.user_id && !isValidObjectId(String(data.user_id)))
            return res.status(400).json({ message: "user_id is invalid" });

        // If coords provided, validate
        if (data.coords !== undefined) {
            if (!Array.isArray(data.coords) || data.coords.length !== 2 || data.coords.some((n) => !Number.isFinite(n))) {
                return res.status(400).json({ message: "coords must be [lat,lng] numbers" });
            }
        }

        const updated = await VehicleListing.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        })
            .populate("category", "title")
            .populate("user_id");

        if (!updated) return res.status(404).json({ message: "Not found" });
        return res.json(updated);
    } catch (err) {
        if (err?.name === "ValidationError") {
            return res.status(400).json({ message: "Validation error", errors: err.errors });
        }
        return res.status(500).json({ message: "Server error", error: err?.message });
    }
};

export const deleteVehicleListing = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });

        const deleted = await VehicleListing.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Not found" });

        return res.json({ message: "Deleted", id });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err?.message });
    }
};

// Optional: increment views
export const incrementVehicleListingViews = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });

        const doc = await VehicleListing.findByIdAndUpdate(
            id,
            { $inc: { number_of_views: 1 } },
            { new: true }
        );
        if (!doc) return res.status(404).json({ message: "Not found" });

        return res.json(doc);
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err?.message });
    }
};