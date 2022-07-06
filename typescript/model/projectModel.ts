import { Schema, model } from "mongoose";

const projectSchema = new Schema({
   name: {
      type: String,
      required: true,
   },
   creationDate: {
      type: Date,
      required: true,
   },
   imgURL: {
      type: String,
      required: true,
   },
   otherImg: {
      type: Array,
      required: false,
   },
   description: {
      type: String,
      required: true,
   },
   components: {
      type: Array,
      required: true,
   },
   linkToProject: {
      type: String,
      required: false,
   },
   linkToGithub: {
      type: String,
      required: false,
   },
   isMini: {
      type: Boolean,
      required: true,
   },
});

export const modelProject = model("project", projectSchema);
