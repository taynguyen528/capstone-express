import express from "express";
import {
    createImage,
    getUser,
    getUserCreatedImages,
    getUserSavedImages,
    updateUser,
} from "../controllers/authController.js";
import { verifyToken } from "../config/jwt.js";

const userRouter = express.Router();

userRouter.get('/get-user/:id', verifyToken, getUser)
userRouter.get('/get-user-save-img/:id', getUserSavedImages)
userRouter.get('/get-user-create-img/:id', getUserCreatedImages)
userRouter.post('/add-image/:id', createImage)
userRouter.put('/update-user/:id', updateUser)

export default userRouter;
