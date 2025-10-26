import mongoose from "mongoose";

const { Schema, model } = mongoose;

const propertyCategoriesSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
    }, { timestamps: true });

const PropertyCategories = model("PropertyCategories", propertyCategoriesSchema);
export default PropertyCategories;