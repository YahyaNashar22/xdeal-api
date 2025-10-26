import mongoose from "mongoose";

const { Schema, model } = mongoose;

const favoritePropertySchema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        property_id: {
            type: Schema.Types.ObjectId,
            ref: "PropertyListing",
            required: true
        }
    }, { timestamps: true });

favoritePropertySchema.index({ user_id: 1, property_id: 1 }, { unique: true });

const FavoriteProperty = model("FavoriteProperty", favoritePropertySchema);
export default FavoriteProperty;