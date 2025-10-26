import mongoose from "mongoose";

const { Schema, model } = mongoose;

const vehicleCategoriesSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
    }, { timestamps: true });

const VehicleCategories = model("VehicleCategories", vehicleCategoriesSchema);
export default VehicleCategories;