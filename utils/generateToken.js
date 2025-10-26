import jwt from "jsonwebtoken";

export const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, is_admin: user.is_admin },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};