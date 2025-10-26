import { Strategy as LocalStrategy } from "passport-local";
import User from "../../models/user.model.js";
import bcrypt from "bcryptjs";

const localStrategy = new LocalStrategy(
    {
        usernameField: "identifier", // can be email or phone
        passwordField: "password"
    },
    async (identifier, password, done) => {
        try {
            const user = await User.findOne({
                $or: [{ email: identifier }, { phone_number: identifier }]
            }).select("+password");

            if (!user) return done(null, false, { message: "User not found" });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return done(null, false, { message: "Invalid credentials" });

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
);

export default localStrategy;
