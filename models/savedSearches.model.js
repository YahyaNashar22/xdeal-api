import mongoose from "mongoose";

const { Schema, model } = mongoose;

const savedSearchesSchema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        search_term: {
            type: String,
            required: true
        },
    }, { timestamps: true });

const SavedSearches = model("SavedSearches", savedSearchesSchema);
export default SavedSearches;