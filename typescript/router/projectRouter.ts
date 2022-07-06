import * as express from "express";
import ProjectController from "../controller/ProjectController";
import { modelProject } from "../model/projectModel";
import multer from "../middleware/multer-config";
import Auth from "../middleware/Auth";

const projectController = new ProjectController(modelProject);

const projectRouter = (function (Router: () => express.Router) {
   const router = Router();

   router.route("/all").get((req, res, next) => projectController.findAll(req, res));

   router.route("/one/:id").get((req, res, next) => projectController.findOne(req, res));

   router.route("/new").post(
      (req, res, next) => Auth.checkAuth(req, res, next),
      multer,
      (req, res) => projectController.create(req, res)
   );

   router.route("/update/:id").put(
      (req, res, next) => Auth.checkAuth(req, res, next),
      multer,
      (req, res) => projectController.update(req, res)
   );

   router.route("/update/addProjectImg/:id").put(
      (req, res, next) => Auth.checkAuth(req, res, next),
      multer,
      (req, res) => projectController.addProjectImages(req, res)
   );

   router.route("/update/deleteProjectImg/:id").put(
      (req, res, next) => Auth.checkAuth(req, res, next),
      multer,
      (req, res) => projectController.deleteProjectImages(req, res)
   );

   router.route("/delete/:id").delete(
      (req, res, next) => Auth.checkAuth(req, res, next),
      (req, res, next) => projectController.delete(req, res)
   );

   return router;
})(express.Router);

export default projectRouter;
