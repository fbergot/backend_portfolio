import { Request, Response } from "express";
import { Model } from "mongoose";
import * as dotenv from "dotenv";
import Bcrypt from "../class/Bcrypt";
import Jwt from "../class/Jwt";

dotenv.config();

type UserData = {
   name: string;
   password: string;
};

type Messages = {
   [key: string]: string;
};

class UserController {
   messages: Messages;

   constructor(private model: Model<UserData>) {
      this.model = model;
      this.messages = {
         created: "User created",
         deleted: "User deleted",
         alreadyExist: "User already exist",
         notExist: "Any user",
         badInfos: "Bad password or bad name",
      };
   }

   async signup(req: Request, res: Response) {
      try {
         const user = await this.model.find();
         const noUserExist = user.length === 0;

         if (noUserExist) {
            const salt = process.env.SALT ?? "10";
            const hashOfPassword = await Bcrypt.bcryptHash(req.body.password, parseInt(salt));
            const hashName = await Bcrypt.bcryptHash(req.body.name, parseInt(salt));
            const userData = { name: hashName, password: hashOfPassword };
            const newUser = new this.model(userData);
            await newUser.save();
            res.status(201).json({ message: this.messages.created });
         } else {
            res.status(409).json({ message: this.messages.alreadyExist });
         }
      } catch (err: any) {
         res.status(500).json({ error: err.message });
      }
   }

   async signin(req: Request, res: Response) {
      try {
         const user = await this.model.find();
         const noUserExist = user.length === 0;

         if (noUserExist) {
            res.status(404).json({ message: this.messages.notExist });
            return;
         }

         const matchName = await Bcrypt.bcryptCompare(req.body.name, user[0].name);
         const matchPassword = await Bcrypt.bcryptCompare(req.body.password, user[0].password);

         if (!matchName || !matchPassword) {
            res.status(401).json({ message: this.messages.badInfos });
            return;
         }
         const payloadForToken = { id: user[0]._id };
         const secretForToken = process.env.SECRET;
         if (!secretForToken) {
            throw Error("Not secret");
         }
         const tokenSigned = await Jwt.jwtSign(payloadForToken, secretForToken, {
            expiresIn: "6h",
         });
         res.status(200).json({ token: tokenSigned });
      } catch (err: any) {
         res.status(500).json({ error: err.message });
      }
   }
}

export default UserController;
