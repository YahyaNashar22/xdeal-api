import express from "express";
import userRouter from "./v1/user.routes.js";

const apiV1Router = express.Router();

apiV1Router.use('/users', userRouter)

export default apiV1Router;