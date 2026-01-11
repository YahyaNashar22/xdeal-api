import express from "express";
import { upload } from "../../middlewares/upload.js";

const userRouter = express.Router();

userRouter.get('/', (req, res) => res.send("users"));
userRouter.post("/uploads/users", upload.single("file"), (req, res) => {
    res.json({ filePath: `/uploads/users/${req.file.filename}` });
});

export default userRouter;