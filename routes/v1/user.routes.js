import express from "express";
import mongoose from "mongoose";
import { upload } from "../../middlewares/upload.js";
import User from "../../models/user.model.js";

const userRouter = express.Router();

userRouter.get('/', (req, res) => res.send("users"));
userRouter.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user id" });
        }

        const user = await User.findById(id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        return res.json(user);
    } catch (err) {
        return res.status(500).json({
            message: "Failed to load user",
            error: err?.message ?? String(err),
        });
    }
});
userRouter.post("/uploads/users", upload.single("file"), (req, res) => {
    res.json({ filePath: `/uploads/users/${req.file.filename}` });
});

export default userRouter;
