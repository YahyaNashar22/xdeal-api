import passport from "passport";
import { generateToken } from "../utils/generateToken.js";
import User from "../models/user.model.js";

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
        res.status(400).json({ error: err.message });
    }
}