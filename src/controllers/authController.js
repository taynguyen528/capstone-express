import { PrismaClient } from "@prisma/client";
import { response } from "../config/configResponse.js";
import bcrypt from "bcrypt";
import {
  checkRefreshToken,
  checkToken,
  createRefreshToken,
  createToken,
  decodeToken,
} from "../config/jwt.js";
const prisma = new PrismaClient();

const testApi = (req, res) => {
  res.send("123");
};

const signUp = async (req, res) => {
  const { email, matKhau, hoTen, tuoi } = req.body;

  if (!email || !matKhau || !hoTen) {
    return response(
      res,
      "",
      "Email, mật khẩu và họ tên không được để trống!",
      400
    );
  }

  try {
    const checkUser = await prisma.nguoi_dung.findUnique({
      where: { email },
    });

    if (checkUser) {
      return response(res, "", "Email đã được sử dụng", 400);
    }

    const newUser = await prisma.nguoi_dung.create({
      data: {
        email,
        mat_khau: bcrypt.hashSync(matKhau, 10),
        ho_ten: hoTen,
        tuoi: tuoi ? parseInt(tuoi, 10) : null,
      },
    });

    return response(res, newUser, "Đăng ký thành công", 200);
  } catch (error) {
    console.log(error);
    return response(res, "", "Lỗi server", 500);
  }
};

const login = async (req, res) => {
  const { email, matKhau } = req.body;

  if (!email || !matKhau) {
    return response(res, "", "Email và mật khẩu không được để trống!", 400);
  }

  try {
    const user = await prisma.nguoi_dung.findUnique({
      where: { email },
    });
    if (!user) {
      return response(
        res,
        "",
        "Đăng nhập không thành công, vui lòng kiểm tra lại thông tin.",
        401
      );
    }

    const checkPassword = bcrypt.compareSync(matKhau, user.mat_khau);
    if (!checkPassword) {
      return response(
        res,
        "",
        "Đăng nhập không thành công, vui lòng kiểm tra lại thông tin.",
        401
      );
    }

    let accessToken = createToken({
      nguoi_dung_id: user.nguoi_dung_id,
      email: user.email,
    });

    let refreshToken = createRefreshToken({
      nguoi_dung_id: user.nguoi_dung_id,
      email: user.email,
    });

    await prisma.nguoi_dung.update({
      where: {
        nguoi_dung_id: user.nguoi_dung_id,
      },
      data: {
        refreshToken: refreshToken,
      },
    });

    console.log("checkUser", user);
    return response(res, accessToken, "Đăng nhập thành công", 200);
  } catch (error) {
    return response(res, "", error, 500);
  }
};

// reset Token
const resetToken = async (req, res) => {
  let { token } = req.headers;

  // Kiểm tra token
  let errorToken = checkToken(token);
  // console.log("check errorToken:", errorToken);
  if (errorToken != null && errorToken.name != "TokenExpiredError") {
    response(res, "", "Not Authorized", 401);
    return;
  }

  let { data } = decodeToken(token);
  let getUser = await prisma.nguoi_dung.findUnique({
    where: { nguoi_dung_id: data.nguoi_dung_id },
  });
  // console.log("check getUser:", getUser);

  if (!getUser) {
    response(res, "", "Not Authorized", 401);
    return;
  }

  // Kiểm tra refresh token
  if (checkRefreshToken(getUser.refreshToken) != null) {
    response(res, "", "Not Authorized", 401);
    return;
  }

  // Tạo token mới
  let tokenNew = createToken({
    nguoi_dung_id: getUser.nguoi_dung_id,
    email: getUser.email,
  });

  response(res, tokenNew, "Tạo mới token thành công", 200);
};

//khoa
const getUser = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return response(res, null, "Vui lòng cung cấp nguoi_dung_id", 400);
  }

  try {
    const user = await prisma.nguoi_dung.findUnique({
      where: { nguoi_dung_id: parseInt(id, 10) },
      select: { email: true, ho_ten: true, tuoi: true },
    });

    if (!user) {
      return response(res, null, "Không tìm thấy thông tin người dùng", 404);
    }

    return response(res, user, "Lấy thông tin người dùng thành công", 200);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    return response(res, null, "Lỗi server", 500);
  }
};

const getUserSavedImages = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return response(res, null, "Vui lòng cung cấp id người dùng", 400);
  }

  try {
    const savedImages = await prisma.luu_anh.findMany({
      where: { nguoi_dung_id: parseInt(id, 10) },
      include: {
        hinh_anh: {
          select: {
            hinh_id: true,
            ten_hinh: true,
            duong_dan: true,
            mo_ta: true,
          },
        },
      },
    });

    if (!savedImages.length) {
      return response(res, null, "Người dùng này chưa lưu ảnh nào", 404);
    }

    return response(
      res,
      savedImages.map((sa) => sa.hinh_anh),
      "Lấy danh sách ảnh đã lưu thành công",
      200
    );
  } catch (error) {
    console.error("Lỗi khi lấy danh sách ảnh đã lưu:", error);
    return response(res, null, "Lỗi server", 500);
  }
};

const getUserCreatedImages = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return response(res, null, "Vui lòng cung cấp id người dùng", 400);
  }

  try {
    const createdImages = await prisma.hinh_anh.findMany({
      where: { nguoi_dung_id: parseInt(id, 10) },
      select: {
        hinh_id: true,
        ten_hinh: true,
        duong_dan: true,
        mo_ta: true,
      },
    });

    if (!createdImages.length) {
      return response(res, null, "Người dùng này chưa tạo ảnh nào", 404);
    }

    return response(
      res,
      createdImages,
      "Lấy danh sách ảnh đã tạo thành công",
      200
    );
  } catch (error) {
    console.error("Lỗi khi lấy danh sách ảnh đã tạo:", error);
    return response(res, null, "Lỗi server", 500);
  }
};

const createImage = async (req, res) => {
    const { id } = req.params;
    const { ten_hinh, duong_dan, mo_ta } = req.body;

    if (!id || !ten_hinh || !duong_dan) {
        return response(res, null, "Vui lòng cung cấp đầy đủ thông tin ảnh và id người dùng", 400);
    }

    try {
        const newImage = await prisma.hinh_anh.create({
            data: {
                nguoi_dung_id: parseInt(id, 10),
                ten_hinh,
                duong_dan,
                mo_ta,
            },
        });

        return response(res, newImage, "Tạo ảnh mới thành công", 201);
    } catch (error) {
        console.error("Lỗi khi tạo ảnh mới:", error);
        return response(res, null, "Lỗi server", 500);
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    if (!id || !updates || Object.keys(updates).length === 0) {
        return response(res, null, "Vui lòng cung cấp đầy đủ thông tin cần cập nhật và id người dùng", 400);
    }

    try {
        const updatedUser = await prisma.nguoi_dung.update({
            where: { nguoi_dung_id: parseInt(id, 10) },
            data: updates,
        });

        return response(res, updatedUser, "Cập nhật thông tin cá nhân thành công", 200);
    } catch (error) {
        console.error("Lỗi khi cập nhật thông tin cá nhân:", error);
        return response(res, null, "Lỗi server", 500);
    }
};

export {
  signUp,
  login,
  testApi,
  resetToken,
  getUser,
  getUserSavedImages,
  getUserCreatedImages,
  createImage,
  updateUser
};
