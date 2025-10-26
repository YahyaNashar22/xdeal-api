import mongoose from "mongoose";

const { Schema, model } = mongoose;

const adsSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
    }, { timestamps: true });

const Ads = model("Ads", adsSchema);
export default Ads;