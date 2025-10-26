import mongoose from "mongoose";

const { Schema, model } = mongoose;

const notificationSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false
        },
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    }, { timestamps: true });

const Notification = model("Notification", notificationSchema);
export default Notification;