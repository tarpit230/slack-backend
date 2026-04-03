import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI: string = process.env.MONGO_URI ?? '';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log("Unknown error:", error);
    }
    process.exit(1);
  }
};

export default connectDB;