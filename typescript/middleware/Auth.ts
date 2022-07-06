import { NextFunction, Request, Response } from "express";
import utilsInstance from "../class/Utils";
import Jwt from "../class/Jwt";
import * as dotenv from "dotenv";

dotenv.config();

class Auth {
   static tokErrMess = "Any token in header or malformed";

   static async checkAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
         const secret = process.env.SECRET || "";
         const tokenFromHeader = utilsInstance.getTokenInHeader(req, this.tokErrMess);
         await Jwt.jwtVerify(tokenFromHeader, secret);
         next();
      } catch (err: any) {
         res.status(401).json({ error: err.message });
      }
   }
}

export default Auth;
