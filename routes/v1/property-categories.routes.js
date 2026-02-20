import { Router } from "express";
import {
    createPropertyCategory,
    deletePropertyCategory,
    getPropertyCategories,
    getPropertyCategoryById,
    updatePropertyCategory,
} from "../../controllers/property-categories.controller.js";

const propertyCategoriesRouter = Router();

// /api/property-categories
propertyCategoriesRouter.post("/", createPropertyCategory);
propertyCategoriesRouter.get("/", getPropertyCategories);
propertyCategoriesRouter.get("/:id", getPropertyCategoryById);
propertyCategoriesRouter.put("/:id", updatePropertyCategory);
propertyCategoriesRouter.delete("/:id", deletePropertyCategory);

export default propertyCategoriesRouter;