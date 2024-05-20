// yarn add jsonwebtoken
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// tạo token
export const createToken = (data) => {
    return jwt.sign({ data: data }, "BI_MAT", { expiresIn: "10d" });
};

// tạo refresh token
export const createRefreshToken = (data) => {
    return jwt.sign({ data: data }, "BI_MAT_REF", { expiresIn: "60d" });
};

// kiểm tra token
export const checkToken = (token) => {
    return jwt.verify(token, "BI_MAT", (error) => {
        return error;
    });
};

// check refresh token
export const checkRefreshToken = (token) => {
    return jwt.verify(token, "BI_MAT_REF", (error) => {
        return error;
    });
};

// giải mã token
export const decodeToken = (token) => {
    return jwt.decode(token);
};

// verify token
export const verifyToken = (req, res, next) => {
    let { token } = req.headers;

    let err = checkToken(token);
    //check token
    if (err == null) {
        next();
        return;
    }

    res.status(401).send(err.name);
};
