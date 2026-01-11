import passport from "passport";

import User from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";
import transporter from "../utils/nodemailerTransporter.js";
import Otp from "../models/otp.model.js";

export const login = (req, res, next) => {
    passport.authenticate("local", { session: false }, (error, user, info) => {
        if (error) return next(error);
        if (!user) return res.status(400).json({ message: info?.message || "login failed" });

        const token = generateToken(user);
        res.json({
            token,
            user: {
                id: user._id,
                full_name: user.full_name,
                email: user.email,
                phone_number: user.phone_number,
                plan: user.plan,
                is_admin: user.is_admin
            }
        });
    })(req, res, next);
};

export const signup = async (req, res) => {
    try {
        const { full_name, email, phone_number, password, profile_picture } = req.body;
        const user = await User.create({ full_name, email, phone_number, password, profile_picture });
        res.status(201).json({ message: "User created", user });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: err.message });
    }
}


export const sendOtp = async (req, res) => {
    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await Otp.create({
            email,
            otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        });

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "XDeal - OTP Code",
            html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Verification Code</h2>
          <p>Your OTP code is:</p>
          <h1>${otp}</h1>
          <p>This code expires in 5 minutes.</p>
        </div>
      `,
        };


        await transporter.sendMail(mailOptions);
        return res.json({ message: "OTP sent successfully", otp });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: err.message });
    }
}

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;


        const record = await Otp.findOne({ email, otp });

        if (!record) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        await Otp.deleteMany({ email }); // cleanup after success

        res.json({ message: "OTP verified" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Verification failed" });
    }
};