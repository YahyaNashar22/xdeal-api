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
            required: true
        },
        phone_number: {
            type: String,
            required: true
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
    }, { timestamps: true });

const User = model("User", userSchema);
export default User;