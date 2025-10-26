import express from "express";
import { login } from "../../controllers/auth.controller.js";

const authRouter = new express.Router();

authRouter.post('/login', login);

export default authRouter;