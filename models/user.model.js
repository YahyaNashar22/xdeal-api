import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
        full_name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        phone_number: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            select: false
        },
        profile_picture: {
            type: String,
            required: true
        },
        number_of_listings: {
            type: Number,
            required: true,
            default: 0
        },
        plan: {
            type: String,
            required: true,
            enum: ["free", "paid"],
            default: "free"
        },
        language: {
            type: String,
            required: true,
            enum: ["en", "ar"],
            default: "en"
        },
        is_admin: {
            type: Boolean,
            required: true,
            default: false
        }
    }, { timestamps: true });

    // hash password before saving document
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const bcrypt = await import("bcryptjs");
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


const User = model("User", userSchema);
export default User;