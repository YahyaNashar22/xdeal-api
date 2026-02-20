import express from "express";
import userRouter from "./v1/user.routes.js";
import authRouter from "./v1/auth.routes.js";
import vehicleCategoriesRouter from "./v1/vehicle-categories.routes.js";
import propertyCategoriesRouter from "./v1/property-categories.routes.js";

const apiV1Router = express.Router();

apiV1Router.use('/users', userRouter);
apiV1Router.use("/auth", authRouter);
apiV1Router.use("/vehicle-categories", vehicleCategoriesRouter);
apiV1Router.use("/property-categories", propertyCategoriesRouter);


export default apiV1Router;