// routes/v1/ads.router.js
import { Router } from "express";
import {
    createAd,
    getAds,
    getAdById,
    updateAd,
    deleteAd,
} from "../../controllers/ads.controller.js";
import { protect, requireAdmin } from "../../middlewares/authMiddleware.js";

const adsRouter = Router();

adsRouter.post("/", protect, requireAdmin, createAd);
adsRouter.get("/", getAds);
adsRouter.get("/:id", getAdById);
adsRouter.put("/:id", protect, requireAdmin, updateAd);
adsRouter.delete("/:id", protect, requireAdmin, deleteAd);

export default adsRouter;
