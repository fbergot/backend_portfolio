import { NextFunction, Request, Response } from "express";
import { Model } from "mongoose";
import * as fs from "fs";

export type ProjectData = {
   name: string;
   creationDate: Date;
   imgURL: string;
   otherImg: string[];
   description: string;
   components: string[];
   linkToProject?: string;
   linkToGithub?: string;
   isMini: boolean;
};

type Messages = {
   [key: string]: string;
};

class ProjectController {
   messages: Messages;

   constructor(private model: Model<ProjectData>) {
      this.model = model;
      this.messages = {
         created: "Project created",
         deleted: "Project deleted",
         updated: "Project updated",
         any: "Any project with this id",
         anyImg: "Any image in the request",
      };
   }

   async findAll(_: Request, res: Response) {
      try {
         const projects = await this.model.find();
         res.status(200).json(projects);
      } catch (err: any) {
         res.status(500).json({ error: err.message });
      }
   }

   async findOne(req: Request, res: Response) {
      try {
         const filter = { _id: req.params.id };
         const project = await this.model.findOne(filter);
         res.status(200).json([project]);
      } catch (err: any) {
         res.status(500).json({ error: err.message });
      }
   }

   async create(req: Request, res: Response) {
      try {
         let components;
         let pathImg = "";
         var projectData: ProjectData | undefined;

         if (req.body.components) {
            components = req.body.components.split(",").map((compo: string) => compo.trim());
         } else {
            components = null;
         }

         if (req.file) {
            pathImg = `${req.protocol}://${req.get("host")}/images/${req.file?.filename}`;
         }

         projectData = {
            name: req.body.name,
            creationDate: new Date(parseInt(req.body.creationDate) * 1000),
            imgURL: pathImg,
            otherImg: [],
            description: req.body.description,
            components: components,
            linkToProject: req.body.linkToProject,
            linkToGithub: req.body.linkToGithub,
            isMini: req.body.isMini,
         };

         const newProductDoc = new this.model(projectData);
         await newProductDoc.save();

         res.status(201).json({ message: this.messages.created });
      } catch (err: any) {
         try {
            // if image register in folder images, delete this img
            let filenameImg;
            if (projectData && projectData.imgURL) {
               filenameImg = projectData.imgURL.split("/images/")[1];
               fs.unlink(`images/${filenameImg}`, (err) => {
                  if (err) throw err;
               });
            }
         } catch (err: any) {
            res.status(500).json({ error: err.message });
            return;
         }
         res.status(500).json({ error: err.message });
      }
   }

   async update(req: Request, res: Response) {
      const filter = { _id: req.params.id };
      let pathImg = "";
      let components = [""];
      let filenameOldImg: string;

      try {
         const projectOfUpdate = await this.model.findOne(filter);
         if (!projectOfUpdate) {
            res.status(404).json({ message: this.messages.any });
            return;
         }

         if (req.file) {
            pathImg = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
            // if old img, deletion
            if (projectOfUpdate.imgURL) {
               filenameOldImg = projectOfUpdate.imgURL.split("/images/")[1];
               fs.unlink(`images/${filenameOldImg}`, (err) => {
                  if (err) throw err;
               });
            }
         }

         if (req.body.components) {
            components = req.body.components.split(",").map((compo: string) => compo.trim());
         }

         (projectOfUpdate.name = req.body.name ?? projectOfUpdate.name),
            //
            (projectOfUpdate.creationDate = req.body.creationDate
               ? new Date(parseInt(req.body.creationDate) * 1000)
               : projectOfUpdate.creationDate),
            //
            (projectOfUpdate.imgURL = req.file ? pathImg : projectOfUpdate.imgURL),
            //
            (projectOfUpdate.description = req.body.description ?? projectOfUpdate.description),
            //
            (projectOfUpdate.components = req.body.components
               ? components
               : projectOfUpdate.components),
            //
            (projectOfUpdate.linkToProject =
               req.body.linkToProject ?? projectOfUpdate.linkToProject),
            //
            (projectOfUpdate.linkToGithub = req.body.linkToGithub ?? projectOfUpdate.linkToGithub),
            //
            (projectOfUpdate.isMini = req.body.isMini ?? projectOfUpdate.isMini);

         await projectOfUpdate.save();
         res.status(200).json({ message: this.messages.updated });
      } catch (err: any) {
         res.status(500).json({ error: err.message });
      }
   }

   async addProjectImages(req: Request, res: Response) {
      if (!req.file) {
         res.status(400).json({ message: this.messages.anyImg });
         return;
      }

      const filter = { _id: req.params.id };
      let pathImg = "";
      let otherProjectImgs: string[];

      try {
         const projectOfUpdate = await this.model.findOne(filter);
         if (!projectOfUpdate) {
            res.status(404).json({ message: this.messages.any });
            return;
         }

         pathImg = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
         otherProjectImgs = projectOfUpdate.otherImg.concat(pathImg);
         projectOfUpdate.otherImg = otherProjectImgs;

         await projectOfUpdate.save();
         res.status(200).json({ message: this.messages.updated });
      } catch (err: any) {
         res.status(500).json({ error: err.message });
      }
   }

   async deleteProjectImages(req: Request, res: Response) {
      const filter = { _id: req.params.id };
      let pathCurrentImg = "";

      try {
         const project = await this.model.findOne(filter);
         if (!project) {
            res.status(404).json({ message: this.messages.any });
            return;
         }

         const arrayOfPathImgToDelete = project.otherImg;
         let i = 0;

         // delete img in images folder and in project
         project.otherImg = [];
         const recursiveLoopToDeleteImgs = async (i: number) => {
            if (arrayOfPathImgToDelete[i]) {
               pathCurrentImg = arrayOfPathImgToDelete[i].split("/images/")[1];
               fs.unlink(`images/${pathCurrentImg}`, (err) => {
                  if (err) throw err;
                  recursiveLoopToDeleteImgs(++i);
               });
            }
         };
         recursiveLoopToDeleteImgs(i);

         await project.save();
         res.status(200).json({ message: this.messages.updated });
      } catch (err: any) {
         res.status(500).json({ error: err.message });
      }
   }

   async delete(req: Request, res: Response) {
      const filter = { _id: req.params.id };

      try {
         const project = await this.model.findOne(filter);
         if (!project) {
            res.status(404).json({ message: this.messages.any });
            return;
         }
         // delete img in images folder
         let filenameImg = project.imgURL.split("/images/")[1];
         fs.unlink(`images/${filenameImg}`, (err) => {
            if (err) throw err;
         });

         const deletionCount = await this.model.deleteOne(filter);
         res.status(200).json({ ...deletionCount, message: this.messages.deleted });
      } catch (err: any) {
         res.status(500).json({ error: err.message });
      }
   }

   verifParamInURL(req: Request, res: Response) {}
}

export default ProjectController;
