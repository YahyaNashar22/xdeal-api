import express from "express";
import userRouter from "./v1/user.routes.js";
import authRouter from "./v1/auth.routes.js";
import vehicleCategoriesRouter from "./v1/vehicle-categories.routes.js";
import propertyCategoriesRouter from "./v1/property-categories.routes.js";
import vehicleListingsRouter from "./v1/vehicle-listing.routes.js";
import uploadRouter from "./v1/uploads.routes.js";
import favoriteVehicleRouter from "./v1/favorite-vehicle.routes.js";
import propertyListingRouter from "./v1/property-listing.routes.js";
import favoritePropertyRouter from "./v1/favorite-property.routes.js";
import adsRouter from "./v1/ads.routes.js";
import notificationRouter from "./v1/notification.routes.js";
import savedSearchesRouter from "./v1/saved-searches.routes.js";

const apiV1Router = express.Router();

apiV1Router.use('/users', userRouter);
apiV1Router.use("/auth", authRouter);
apiV1Router.use("/vehicle-categories", vehicleCategoriesRouter);
apiV1Router.use("/property-categories", propertyCategoriesRouter);
apiV1Router.use("/vehicle-listing", vehicleListingsRouter);
apiV1Router.use("/property-listing", propertyListingRouter);
apiV1Router.use("/uploads", uploadRouter);
apiV1Router.use("/favorite-vehicles", favoriteVehicleRouter);
apiV1Router.use("/favorite-property", favoritePropertyRouter);
apiV1Router.use("/ads", adsRouter);
apiV1Router.use("/notifications", notificationRouter);
apiV1Router.use("/saved-searches", savedSearchesRouter);

export default apiV1Router;