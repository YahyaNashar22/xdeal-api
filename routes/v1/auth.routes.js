import express from "express";
import { getMe, login, sendOtp, signup, verifyOtp } from "../../controllers/auth.controller.js";
import { protect } from "../../middlewares/authMiddleware.js";

const authRouter = new express.Router();

authRouter.post('/signin', login);
authRouter.post('/signup', signup);
authRouter.post('/send-otp', sendOtp);
authRouter.post('/verify-otp', verifyOtp);
authRouter.get("/me", protect, getMe);



export default authRouter; 