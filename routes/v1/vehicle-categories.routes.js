import { Router } from "express";
import {
    createVehicleCategory,
    deleteVehicleCategory,
    getVehicleCategories,
    getVehicleCategoryById,
    updateVehicleCategory,
} from "../../controllers/vehicle-categories.controller.js";

const vehicleCategoriesRouter = Router();

// /api/vehicle-categories
vehicleCategoriesRouter.post("/", createVehicleCategory);
vehicleCategoriesRouter.get("/", getVehicleCategories);
vehicleCategoriesRouter.get("/:id", getVehicleCategoryById);
vehicleCategoriesRouter.put("/:id", updateVehicleCategory);
vehicleCategoriesRouter.delete("/:id", deleteVehicleCategory);

export default vehicleCategoriesRouter;