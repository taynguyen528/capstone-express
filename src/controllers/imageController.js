import { PrismaClient } from "@prisma/client";
import { response } from "../config/configResponse.js";
const prisma = new PrismaClient();

const getListImage = async (req, res) => {
    try {
        const images = await prisma.hinh_anh.findMany();

        return response(res, images, "Lấy danh sách ảnh thành công", 200);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách ảnh:", error);
        return response(res, null, "Lỗi server", 500);
    }
};
const searchImages = async (req, res) => {
    try {
        const { ten_hinh } = req.body;

        let images;
        if (ten_hinh) {
            images = await prisma.hinh_anh.findMany({
                where: {
                    ten_hinh: {
                        contains: ten_hinh,
                    },
                },
            });
        } else {
            images = await prisma.hinh_anh.findMany();
        }

        return response(res, images, "Lấy danh sách ảnh thành công", 200);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách ảnh:", error);
        return response(res, null, "Lỗi server", 500);
    }
};

const getImageWithCreator = async (req, res) => {
    try {
        const { id } = req.params;
        const imageWithCreator = await prisma.hinh_anh.findUnique({
            where: { hinh_id: parseInt(id) },
            include: {
                nguoi_dung: {
                    select: {
                        nguoi_dung_id: true,
                        email: true,
                        ho_ten: true,
                        tuoi: true,
                    },
                },
            },
        });
        if (imageWithCreator) {
            return response(
                res,
                imageWithCreator,
                "Lấy thông tin ảnh và người tạo thành công",
                200
            );
        } else {
            return response(res, null, "Không tìm thấy ảnh", 404);
        }
    } catch (error) {
        console.error("Lỗi khi lấy thông tin ảnh và người tạo:", error);
        return response(res, null, "Lỗi server", 500);
    }
};

const createComment = async (req, res) => {
    try {
        const { userId, imageId, content } = req.body;
        const ngay_binh_luan = new Date();
        const newComment = await prisma.binh_luan.create({
            data: {
                nguoi_dung_id: parseInt(userId),
                hinh_id: parseInt(imageId),
                noi_dung: content,
                ngay_binh_luan: ngay_binh_luan,
            },
        });
        return response(res, newComment, "Tạo bình luận thành công", 201);
    } catch (error) {
        console.error("Lỗi khi tạo bình luận:", error);
        return response(res, null, "Lỗi server", 500);
    }
};

const getCommentsByImageId = async (req, res) => {
    try {
        const { imageId } = req.params;
        const comments = await prisma.binh_luan.findMany({
            where: { hinh_id: parseInt(imageId) },
            include: {
                nguoi_dung: {
                    select: {
                        nguoi_dung_id: true,
                        email: true,
                        ho_ten: true,
                        tuoi: true,
                    },
                },
            },
        });
        return response(
            res,
            comments,
            "Lấy thông tin bình luận thành công",
            200
        );
    } catch (error) {
        console.error("Lỗi khi lấy thông tin bình luận:", error);
        return response(res, null, "Lỗi server", 500);
    }
};

const checkImageSaved = async (req, res) => {
    try {
        const { imageId, userId } = req.params;
        const savedImage = await prisma.luu_anh.findUnique({
            where: {
                nguoi_dung_id_hinh_id: {
                    nguoi_dung_id: parseInt(userId),
                    hinh_id: parseInt(imageId),
                },
            },
        });
        if (savedImage) {
            return response(res, { saved: true }, "Hình ảnh đã được lưu", 200);
        } else {
            return response(
                res,
                { saved: false },
                "Hình ảnh chưa được lưu",
                200
            );
        }
    } catch (error) {
        console.error("Lỗi khi kiểm tra hình ảnh đã lưu:", error);
        return response(res, null, "Lỗi server", 500);
    }
};

const getAllComments = async (req, res) => {
    try {
        const comments = await prisma.binh_luan.findMany();
        return response(res, comments, "Lấy tất cả bình luận thành công", 200);
    } catch (error) {
        console.error("Lỗi khi lấy tất cả bình luận:", error);
        return response(res, null, "Lỗi server", 500);
    }
};

const deleteImageById = async (req, res) => {
    try {
        const { imageId } = req.params;

        const existingImage = await prisma.hinh_anh.findUnique({
            where: { hinh_id: parseInt(imageId) },
        });

        if (!existingImage) {
            return response(res, null, "Không tìm thấy ảnh", 404);
        }

        await prisma.hinh_anh.delete({
            where: { hinh_id: parseInt(imageId) },
        });

        return response(res, null, "Xóa ảnh thành công", 200);
    } catch (error) {
        console.error("Lỗi khi xóa ảnh:", error);
        return response(res, null, "Lỗi server", 500);
    }
};

export {
    getListImage,
    searchImages,
    getImageWithCreator,
    createComment,
    getCommentsByImageId,
    checkImageSaved,
    getAllComments,
    deleteImageById,
};
