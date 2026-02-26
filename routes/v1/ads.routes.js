// routes/v1/ads.router.js
import { Router } from "express";
import {
    createAd,
    getAds,
    getAdById,
    updateAd,
    deleteAd,
} from "../../controllers/ads.controller.js";

const adsRouter = Router();

adsRouter.post("/", createAd);
adsRouter.get("/", getAds);
adsRouter.get("/:id", getAdById);
adsRouter.put("/:id", updateAd);
adsRouter.delete("/:id", deleteAd);

export default adsRouter;