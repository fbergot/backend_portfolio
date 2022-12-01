import { Mongoose } from "mongoose";

export default class Connect {
   static ok = "Connection database ok";
   static failed = "Connection database failed";

   static async connect(mongoURI: string, options: {}, mongoose: Mongoose): Promise<boolean> {
      try {
         await mongoose.connect(mongoURI, options);
         console.log(this.ok);
         return true;
      } catch (err) {
         console.error(`${this.failed}: ${err}`);
         return false;
      }
   }
}
