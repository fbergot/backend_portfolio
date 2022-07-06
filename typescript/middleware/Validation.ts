import { Request, Response, NextFunction } from "express";
import * as yup from "yup";

class Validation {
   private shemaAuth: any;

   constructor(private yupModule: typeof yup) {
      this.shemaAuth = yupModule.object().shape({
         name: yupModule.string().min(5).max(20).required(),
         password: yupModule.string().min(10).max(30).required(),
      });
   }

   public async checkDataForAuth(req: Request, res: Response, next: NextFunction) {
      let checkIsValid: boolean;
      try {
         checkIsValid = await this.shemaAuth.validate({
            name: req.body.name,
            password: req.body.password,
         });
         checkIsValid ? next() : null;
      } catch (err: any) {
         res.status(400).json({ error: err.message });
      }
   }
}

export default new Validation(yup);
