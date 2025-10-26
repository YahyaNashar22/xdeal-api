import mongoose from "mongoose";

const { Schema, model } = mongoose;

const favoriteVehicleSchema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        vehicle_id: {
            type: Schema.Types.ObjectId,
            ref: "VehicleListing",
            required: true
        }
    }, { timestamps: true });

favoriteVehicleSchema.index({ user_id: 1, vehicle_id: 1 }, { unique: true });

const FavoriteVehicle = model("FavoriteVehicle", favoriteVehicleSchema);
export default FavoriteVehicle;