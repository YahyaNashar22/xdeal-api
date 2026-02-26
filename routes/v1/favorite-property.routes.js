import { Router } from "express";
import {
    addFavoriteProperty,
    removeFavoriteProperty,
    toggleFavoriteProperty,
    getUserFavoriteProperties,
    checkFavoriteProperty,
} from "../../controllers/favorite-property.controller.js";

const favoritePropertyRouter = Router();

favoritePropertyRouter.post("/", addFavoriteProperty);
favoritePropertyRouter.delete("/", removeFavoriteProperty);
favoritePropertyRouter.post("/toggle", toggleFavoriteProperty);
favoritePropertyRouter.get("/user/:user_id", getUserFavoriteProperties);
favoritePropertyRouter.get("/check", checkFavoriteProperty);

export default favoritePropertyRouter;