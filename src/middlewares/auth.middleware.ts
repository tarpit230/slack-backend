// middleware/auth.middleware.ts

import { type Request, type Response, type NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_SECRET as string;

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token" });
    }

    const token = authHeader.split(" ")[1];
    if(!token) {
        return res.status(401).json({ message: "No token" });
    }

    // 2. verify token
    const decoded = jwt.verify(token, ACCESS_SECRET) as JwtPayload;

    // 3. attach user to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};