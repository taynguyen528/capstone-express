import express from "express";
import {
    createComment,
    getImageWithCreator,
    getListImage,
    searchImages,
    getCommentsByImageId,
    checkImageSaved,
    getAllComments,
    deleteImageById,
} from "../controllers/imageController.js";
import { verifyToken } from "../config/jwt.js";

const imageRouter = express.Router();

imageRouter.get("/getListImage", getListImage);
imageRouter.get("/searchImage", searchImages);
imageRouter.get("/images/:id", getImageWithCreator);
imageRouter.post("/createComment", createComment);
imageRouter.get("/getCommentId/:imageId", getCommentsByImageId);
imageRouter.get("/checkImageSaved/:imageId/:userId", checkImageSaved);
imageRouter.get("/getListComment", getAllComments);
imageRouter.delete("/deleteImageId/:imageId", deleteImageById);

export default imageRouter;
