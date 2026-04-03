// controllers/authController.js

import type { Request, Response } from "express";
import bcrypt from "bcrypt"
import User from "../models/users.js";
import Workspace from "../models/workspace.js";
import Membership from "../models/membership.js";
import { generateAccessToken, generateRefreshToken } from "../utilities/jwt-utils.js";

export const signup = async (req: Request, res: Response) => {
  const { name, email, password, workspaceName } = req.body;

  try {
    // 1. check user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 4. create workspace
    const workspace = await Workspace.create({
      name: workspaceName,
      owner: user._id,
    });

    // 5. create membership (OWNER)
    await Membership.create({
      user: user._id,
      workspace: workspace._id,
      role: "OWNER",
    });

    res.status(201).json({
      message: "Signup successful",
      user,
      workspace,
    });
  } catch (error) {
    if(error instanceof Error){
        res.status(500).json({ message: error.message });
    } else {
        res.status(500).json({ message: "Unknown Error in Auth Controller"})
    }
  }
};

export const login = async (
    req: Request,
    res: Response
  ) => {
    const { email, password } = req.body;
  
    try {
      // 1. find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      // 2. compare password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      // 3. get memberships (multi-tenant)
      const memberships = await Membership.find({ user: user._id })
        .populate("workspace");
  
      // 4. generate tokens
      const payload = {
        userId: user._id,
        email: user.email,
      };
  
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);
  
      // 5. send response
      return res.status(200).json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        workspaces: memberships,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
      return res.status(500).json({ message: "Unknown error" });
    }
  };