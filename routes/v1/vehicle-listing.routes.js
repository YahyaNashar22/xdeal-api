// src/routes/v1/vehicle-listings.routes.js
import { Router } from "express";
import {
    createVehicleListing,
    deleteVehicleListing,
    getVehicleListingById,
    getVehicleListings,
    updateVehicleListing,
    incrementVehicleListingViews,
} from "../../controllers/vehicle-listing.controller.js";

const vehicleListingsRouter = Router();

// /api/v1/vehicle-listings
vehicleListingsRouter.post("/", createVehicleListing);
vehicleListingsRouter.get("/", getVehicleListings);
vehicleListingsRouter.get("/:id", getVehicleListingById);
vehicleListingsRouter.put("/:id", updateVehicleListing);
vehicleListingsRouter.delete("/:id", deleteVehicleListing);

// optional views endpoint
vehicleListingsRouter.patch("/:id/views", incrementVehicleListingViews);

export default vehicleListingsRouter;