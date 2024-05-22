import express from "express";
import {
    createImage,
    getUser,
    getUserCreatedImages,
    getUserSavedImages,
    login,
    resetToken,
    signUp,
    testApi,
    updateUser,
} from "../controllers/authController.js";
import { verifyToken } from "../config/jwt.js";

const authRouter = express.Router();

authRouter.get("/test", verifyToken, testApi);
authRouter.post("/sign-up", signUp);
authRouter.post("/login", login);
authRouter.post("/reset-token", resetToken);
authRouter.get('/get-user/:id', verifyToken, getUser)
authRouter.get('/get-user-save-img/:id', getUserSavedImages)
authRouter.get('/get-user-create-img/:id', getUserCreatedImages)
authRouter.post('/add-image/:id', createImage)
authRouter.put('/update-user/:id', updateUser)

export default authRouter;
