import { NextFunction, Request, Response } from "express";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import utilsInstance from "./class/Utils";
import projectRouter from "./router/projectRouter";
import Connect from "./class/Connect";
import userRouter from "./router/userRouter";
import helmet from "helmet";
import Valid from "./middleware/Validation";
const app = express();

dotenv.config();

const uBaseURL = "/api/user";
const pBaseUR = "/api/project";

/**
 * Mongo connection
 */
(async (options: { useNewUrlParser: boolean; useUnifiedTopology: boolean }) => {
   const state: boolean = await Connect.connect(process.env.MONGO_URL || "", options, mongoose);
   // if not DB connection, exit of current process
   if (!state) console.error("Out current process"), process.exit();
})({ useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use(utilsInstance.setHeadersCORS);
app.use("/images", express.static("images"));
app.use(helmet());

// router
app.use(uBaseURL, (req: Request, res: Response, next: NextFunction) => Valid.checkDataForAuth(req, res, next), userRouter);
app.use(pBaseUR, projectRouter);

export default app;
