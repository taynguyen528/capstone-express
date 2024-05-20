import express from "express";
import {
    login,
    resetToken,
    signUp,
    testApi,
} from "../controllers/authController.js";
import { verifyToken } from "../config/jwt.js";

const authRouter = express.Router();

authRouter.get("/test", verifyToken, testApi);
authRouter.post("/sign-up", signUp);
authRouter.post("/login", login);
authRouter.post("/reset-token", resetToken);

export default authRouter;
