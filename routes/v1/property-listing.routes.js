// routes/v1/property-listing.router.js
import { Router } from "express";
import {
    createPropertyListing,
    deletePropertyListing,
    getPropertyListingById,
    getPropertyListings,
    incrementPropertyListingViews,
    updatePropertyListing,
} from "../../controllers/property-listing.controller.js";

const propertyListingRouter = Router();

// /api/v1/property-listing
propertyListingRouter.post("/", createPropertyListing);
propertyListingRouter.get("/", getPropertyListings);
propertyListingRouter.get("/:id", getPropertyListingById);
propertyListingRouter.put("/:id", updatePropertyListing);
propertyListingRouter.delete("/:id", deletePropertyListing);
propertyListingRouter.patch("/:id/views", incrementPropertyListingViews);

export default propertyListingRouter;