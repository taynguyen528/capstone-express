import express from "express";
import authRouter from "./authRouter.js";
import userRouter from "./userRouter.js";

const rootRouter = express.Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/user", userRouter)

export default rootRouter;
