import mongoose, { Types } from "mongoose";

const { Schema, model } = mongoose;

const vehicleListingSchema = new Schema(
    {
        listing_type: {
            type: String,
            enum: ["vehicle", "accessory"],
            required: true,
            default: "vehicle"
        },
        name: {
            type: String,
            required: true
        },
        images: {
            type: [String],
            required: true,
            default: []
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
            ref: "VehicleCategories",
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
        brand: {
            type: String,
            required: function () {
                return this.listing_type === "vehicle";
            }
        },
        model: {
            type: String,
            required: function () {
                return this.listing_type === "vehicle";
            }
        },
        version: {
            type: String,
            required: false,
        },
        condition: {
            type: String,
            required: true,
            enum: ["new", "used"],
            default: "new"
        },
        kilometers: {
            type: Number,
            required: function () {
                return this.listing_type === "vehicle";
            },
            default: 0
        },
        year: {
            type: String,
            required: function () {
                return this.listing_type === "vehicle";
            },
        },
        fuel_type: {
            type: String,
            enum: ['petrol', 'diesel', 'electric', 'hybrid', 'gas'],
            required: function () {
                return this.listing_type === "vehicle";
            }
        },
        transmission_type: {
            type: String,
            required: function () {
                return this.listing_type === "vehicle";
            }
        },
        body_type: {
            type: String,
            required: function () {
                return this.listing_type === "vehicle";
            }
        },
        power: {
            type: Number,
            required: false,
        },
        consumption: {
            type: Number,
            required: false,
        },
        air_conditioning: {
            type: String,
            required: function () {
                return this.listing_type === "vehicle";
            }
        },
        color: {
            type: String,
            required: function () {
                return this.listing_type === "vehicle";
            }
        },
        number_of_seats: {
            type: Number,
            required: function () {
                return this.listing_type === "vehicle";
            }
        },
        number_of_doors: {
            type: Number,
            required: function () {
                return this.listing_type === "vehicle";
            }
        },
        interior: {
            type: String,
            required: function () {
                return this.listing_type === "vehicle";
            }
        },
        accessory_type: {
            type: String,
            required: function () {
                return this.listing_type === "accessory";
            }
        },
        compatibility: {
            type: [String],
            default: []
        },
        warranty_months: {
            type: Number,
            required: false,
        },
        payment_option: {
            type: String,
            enum: ['cash', 'installment'],
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
        number_of_views: {
            type: Number,
            required: true,
            default: 0
        },
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    }, { timestamps: true });

const VehicleListing = model("VehicleListing", vehicleListingSchema);
export default VehicleListing;
