import { Router } from "express";
import { protect } from "../../middlewares/authMiddleware.js";
import {
    removeFavoriteByVehicleId,
    toggleFavorite,
    isFavorited,
    myFavorites,
    myFavoriteVehicleIds, addFavorite
} from "../../controllers/favorite-vehicle.controller.js";

const favoriteVehicleRouter = Router();

favoriteVehicleRouter.use(protect);

favoriteVehicleRouter.post("/", addFavorite);                 // body: { vehicle_id }
favoriteVehicleRouter.post("/toggle", toggleFavorite);        // body: { vehicle_id }

favoriteVehicleRouter.get("/me", myFavorites);                // query: page, limit
favoriteVehicleRouter.get("/me/ids", myFavoriteVehicleIds);   // returns [vehicleId]

favoriteVehicleRouter.get("/check/:vehicleId", isFavorited);
favoriteVehicleRouter.delete("/:vehicleId", removeFavoriteByVehicleId);

export default favoriteVehicleRouter;