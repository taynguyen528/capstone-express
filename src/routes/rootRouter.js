import express from "express";
import authRouter from "./authRouter.js";
import userRouter from "./userRouter.js";
import imageRouter from "./imageRouter.js";
import { verifyToken } from "../config/jwt.js";

const rootRouter = express.Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/user", verifyToken, userRouter);
rootRouter.use("/image", verifyToken, imageRouter);

export default rootRouter;
