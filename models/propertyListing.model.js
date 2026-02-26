import mongoose, { Types } from "mongoose";

const { Schema, model } = mongoose;

const propertyListingSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        images: {
            type: [String],
            required: true,
            default: []
        },
        three_sixty: {
            type: String,
            required: false
        },
        price: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "PropertyCategories",
            required: true
        },
        coords: {
            type: [Number],
            required: true,
            validate: {
                validator: (v) => Array.isArray(v) && v.length === 2,
                message: "coords must be an array of exactly 2 numbers"
            }
        },
        bedrooms: {
            type: Number,
            required: true
        },
        bathrooms: {
            type: Number,
            required: true
        },
        space: {
            type: Number,
            required: true
        },
        extra_features: {
            type: [String],
            required: true,
            default: []
        },
        is_featured: {
            type: Boolean,
            required: true
        },
        is_sponsored: {
            type: Boolean,
            required: true
        },
        is_listed: {
            type: Boolean,
            required: true
        },
        on_sale: {
            type: Boolean,
            required: true
        },
        is_rent: {
            type: Boolean,
            required: true
        },
        number_of_views: {
            type: Number,
            required: true,
            default: 0
        },
        agent_type: {
            type: String,
            enum: ['owner', 'middleman'],
            required: true,
            default: 'owner'
        },
        rental_payment: {
            type: String,
            enum: ['daily', 'monthly', 'yearly'],
            required: function () {
                return this.is_rent === true;
            },
        },
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    }, { timestamps: true });

const PropertyListing = model("PropertyListing", propertyListingSchema);
export default PropertyListing;
