import * as express from "express";
import * as dotenv from "dotenv";
import * as mongoose from "mongoose";
import utilsInstance from "./class/Utils";
import projectRouter from "./router/projectRouter";
import Connect from "./class/Connect";
import userRouter from "./router/userRouter";
import helmet from "helmet";
import Valid from "./middleware/Validation";

dotenv.config();

const app = express();

const uBaseURL = "/api/user";
const pBaseUR = "/api/project";

/**
 * Mongo connection
 */
(async (options: { useNewUrlParser: boolean; useUnifiedTopology: boolean }) => {
   const state: boolean = await Connect.connect(process.env.mongoUrl || "", options, mongoose);
   // if not DB connection, exit of current process
   if (!state) console.error("Out current process"), process.exit();
})({ useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use(utilsInstance.setHeadersCORS);
app.use("/images", express.static("images"));
app.use(helmet());

// router
app.use(uBaseURL, (req, res, next) => Valid.checkDataForAuth(req, res, next), userRouter);
app.use(pBaseUR, projectRouter);

export default app;
