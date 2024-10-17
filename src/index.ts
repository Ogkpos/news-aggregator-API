import { app } from "./app";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const start = async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET must be defined");
  }
  if (!process.env.DATABASE_URI) {
    throw new Error("MongoDb connection string must be available");
  }
  if (!process.env.JWT_EXPIRES_IN) {
    throw new Error("Provide expiration time for token");
  }
  if (!process.env.EMAIL_PORT) {
    throw new Error("");
  }
  if (!process.env.EMAIL_USERNAME) {
    throw new Error("");
  }
  if (!process.env.EMAIL_PASSWORD) {
    throw new Error("");
  }
  if (!process.env.EMAIL_FROM) {
    throw new Error("");
  }
  if (!process.env.OTP_SECRET) {
    throw new Error("");
  }
  if (!process.env.EMAIL_HOST) {
    throw new Error("");
  }

  try {
    await mongoose.connect(process.env.DATABASE_URI!);
    console.log("Connected to database");
  } catch (error) {
    console.log(error);
  }

  app.listen(4000, () => {
    console.log("Running on port 4000");
  });
};
start();
