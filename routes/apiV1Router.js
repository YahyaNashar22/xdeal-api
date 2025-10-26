import express from "express";
import userRouter from "./v1/user.routes.js";
import authRouter from "./v1/auth.routes.js";

const apiV1Router = express.Router();

apiV1Router.use('/users', userRouter);
apiV1Router.use("/auth", authRouter);

export default apiV1Router;