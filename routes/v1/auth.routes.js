import express from "express";
import { login, sendOtp, signup, verifyOtp } from "../../controllers/auth.controller.js";

const authRouter = new express.Router();

authRouter.post('/login', login);
authRouter.post('/signup', signup);
authRouter.post('/send-otp', sendOtp);
authRouter.post('/verify-otp', verifyOtp);


export default authRouter; 