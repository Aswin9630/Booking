import { Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";

export const generateToken = (res: Response, userId: string) => {
  try {
    const token = jwt.sign(
      { id: userId },
      process.env.ACCESS_TOKEN_SECRET_KEY as string,
      { expiresIn: process.env.JWT_EXPIRATION } as SignOptions
    );

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
    });

    return token; 
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
