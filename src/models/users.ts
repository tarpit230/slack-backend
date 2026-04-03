// models/User.js

import mongoose, { Model } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
    name: string;
    email: string;
    password: string;
    avatar?: string;
  }
  
  export interface IUserMethods {
    comparePassword(password: string): Promise<boolean>;
  }
  
  type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function (password: string) {
    return bcrypt.compare(password, this.password);
  };

const User = mongoose.model<IUser, UserModel>("User", userSchema);

export default User;