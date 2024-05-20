import express from "express";
import authRouter from "./authRouter.js";

const rootRouter = express.Router();

rootRouter.use("/auth", authRouter);

export default rootRouter;
