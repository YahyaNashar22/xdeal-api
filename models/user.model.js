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
        address: {
            type: String,
            required: false,
        },
        profile_picture: {
            type: String,
            required: false,
            default: "/uploads/users/avatar.png"
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

const User = model("User", userSchema);
export default User;