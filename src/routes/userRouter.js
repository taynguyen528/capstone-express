import express from "express";
import {
    createImage,
    getUser,
    getUserCreatedImages,
    getUserSavedImages,
    updateUser,
} from "../controllers/userController.js";
import { verifyToken } from "../config/jwt.js";
import { upload } from "../config/upload.js";

const userRouter = express.Router();

userRouter.get('/get-user/:id', verifyToken, getUser)
userRouter.put('/update-user/:id', updateUser)
userRouter.post("/create-image/:id", upload.single("duong_dan"), createImage)   
userRouter.get('/get-user-save-img/:id', getUserSavedImages)
userRouter.get('/get-user-create-img/:id', getUserCreatedImages)

export default userRouter;
