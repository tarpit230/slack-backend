import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
    throw new Error("JWT secrets are not defined in environment variables");
  }

export const generateAccessToken = (payload: object) => {
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
  };
  
  export const generateRefreshToken = (payload: object) => {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
  };