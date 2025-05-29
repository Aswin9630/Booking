"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (res, userId) => {
    try {
        const token = jsonwebtoken_1.default.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRATION });
        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24,
        });
        return token;
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.generateToken = generateToken;
