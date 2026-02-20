import bcrypt from "bcryptjs";

import User from "../models/user.model.js";

import { generateToken } from "../utils/generateToken.js";
import transporter from "../utils/nodemailerTransporter.js";
import Otp from "../models/otp.model.js";

export const login = async (req, res) => {

    const { email, password } = req.body;

    try {


        const existingUser = await User.findOne({ email }).select('+password');

        if (!existingUser) return res.status(404).json({ error: "email does not exist" });

        const isValidPassword = bcrypt.compareSync(password, existingUser.password);
        if (!isValidPassword)
            return res.status(401).json({ message: "Wrong  Password" });

        const token = generateToken(existingUser);

        return res.status(200).json({
            token,
            user: existingUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const signup = async (req, res) => {
    try {
        const { full_name, email, phone_number, address, password, profile_picture } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) return res.status(400).json({ error: "email already exists" });

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = await User.create({ full_name, email, phone_number, address, password: hashedPassword, profile_picture });

        return res.status(201).json({ message: "User created", user });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message });
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

        console.log("OTP:", otp)

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
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message });
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

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Verification failed", error: error.message });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};