import FavoriteVehicle from "../models/favoriteVehicle.model.js";

function getUserId(req) {
    // adapt to your auth payload
    return req.user?.id || req.user?._id || req.userId;
}

export const addFavorite = async (req, res) => {
    try {
        const userId = getUserId(req);
        const { vehicle_id } = req.body;

        if (!userId) return res.status(401).json({ message: "Unauthorized" });
        if (!vehicle_id) return res.status(400).json({ message: "vehicle_id is required" });

        const doc = await FavoriteVehicle.create({ user_id: userId, vehicle_id });

        return res.status(201).json(doc);
    } catch (err) {
        // unique index duplicate
        if (err?.code === 11000) {
            return res.status(200).json({ message: "Already favorited" });
        }
        return res.status(500).json({ message: err?.message || "Server error" });
    }
};

export const removeFavoriteByVehicleId = async (req, res) => {
    try {
        const userId = getUserId(req);
        const { vehicleId } = req.params;

        if (!userId) return res.status(401).json({ message: "Unauthorized" });
        if (!vehicleId) return res.status(400).json({ message: "vehicleId is required" });

        const deleted = await FavoriteVehicle.findOneAndDelete({
            user_id: userId,
            vehicle_id: vehicleId,
        });

        // idempotent delete
        return res.status(200).json({ removed: !!deleted });
    } catch (err) {
        return res.status(500).json({ message: err?.message || "Server error" });
    }
};

export const toggleFavorite = async (req, res) => {
    try {
        const userId = getUserId(req);
        const { vehicle_id } = req.body;

        if (!userId) return res.status(401).json({ message: "Unauthorized" });
        if (!vehicle_id) return res.status(400).json({ message: "vehicle_id is required" });

        const existing = await FavoriteVehicle.findOne({ user_id: userId, vehicle_id });

        if (existing) {
            await FavoriteVehicle.deleteOne({ _id: existing._id });
            return res.status(200).json({ favorited: false });
        }

        await FavoriteVehicle.create({ user_id: userId, vehicle_id });
        return res.status(200).json({ favorited: true });
    } catch (err) {
        return res.status(500).json({ message: err?.message || "Server error" });
    }
};

export const isFavorited = async (req, res) => {
    try {
        const userId = getUserId(req);
        const { vehicleId } = req.params;

        if (!userId) return res.status(401).json({ message: "Unauthorized" });
        if (!vehicleId) return res.status(400).json({ message: "vehicleId is required" });

        const exists = await FavoriteVehicle.exists({ user_id: userId, vehicle_id: vehicleId });
        return res.status(200).json({ favorited: !!exists });
    } catch (err) {
        return res.status(500).json({ message: err?.message || "Server error" });
    }
};

export const myFavorites = async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const page = Math.max(parseInt(req.query.page || "1", 10), 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit || "20", 10), 1), 100);
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            FavoriteVehicle.find({ user_id: userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                // populate if you want full listing objects
                .populate("vehicle_id"),
            FavoriteVehicle.countDocuments({ user_id: userId }),
        ]);

        return res.status(200).json({
            page,
            limit,
            total,
            items,
        });
    } catch (err) {
        return res.status(500).json({ message: err?.message || "Server error" });
    }
};

export const myFavoriteVehicleIds = async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const ids = await FavoriteVehicle.find({ user_id: userId })
            .select("vehicle_id -_id")
            .sort({ createdAt: -1 });

        return res.status(200).json(ids.map((x) => x.vehicle_id));
    } catch (err) {
        return res.status(500).json({ message: err?.message || "Server error" });
    }
};