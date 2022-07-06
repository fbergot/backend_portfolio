import * as express from "express";
import UserController from "../controller/UserController";
import { modelUser } from "../model/userModel";

const userController = new UserController(modelUser);

const userRouter = (function (Router: () => express.Router) {
   const router = Router();

   router.route("/signup").post((req, res) => userController.signup(req, res));

   router.route("/signin").post((req, res) => userController.signin(req, res));

   return router;
})(express.Router);

export default userRouter;
