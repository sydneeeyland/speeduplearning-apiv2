import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const MongoDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_DB_URI);
    console.log(`Connected to ${conn.connection.host}`);
  } catch (er) {
    console.log(er);
  }
};
