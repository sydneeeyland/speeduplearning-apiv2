// Package
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookie from "cookie-parser";

// Invoke
dotenv.config();

// Route
import PublicRoute from "./Route/public.js";

// Variables
const Application = express();

// Config
import { MongoDB } from "./Config/database.js";

Application.listen(3000, () => {
  MongoDB();
  Application.use(express.json());
  Application.use(express.urlencoded({ extended: false }));
  Application.use(cookie());
  Application.use(
    cors({
      origin: ["*"],
      credentials: true,
    })
  );
  let arr = [
    [1,2],
  [3,4],
  [5,6,[7,8],9],
  [10,11,12]
  ]
  Application.use("/speedup", PublicRoute);
  console.log("Server is running on port 3000");
});