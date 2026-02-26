// routes/v1/notification.router.js
import { Router } from "express";
import {
    createNotification,
    getNotifications,
    getNotificationById,
    updateNotification,
    deleteNotification,
} from "../../controllers/notification.controller.js";

const notificationRouter = Router();

// /api/v1/notifications
notificationRouter.post("/", createNotification);
notificationRouter.get("/", getNotifications);
notificationRouter.get("/:id", getNotificationById);
notificationRouter.put("/:id", updateNotification);
notificationRouter.delete("/:id", deleteNotification);

export default notificationRouter;