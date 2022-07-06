import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

type Payload = {
   [key: string]: any;
};

class Jwt {
   static algo = "HS256" as const;
   /**
    * Sign the token
    * @memberof Jwt
    */
   static async jwtSign(payload: Payload, secret: jwt.Secret, opts: jwt.SignOptions | undefined) {
      return new Promise((resolve, reject) => {
         jwt.sign(payload, secret, { ...opts, algorithm: this.algo }, (err, token) => {
            if (err) reject(err);
            else resolve(token);
         });
      });
   }

   /**
    * Verify the token and return a promise of decoded
    * @memberof Jwt
    */
   static async jwtVerify(token: string, secretOrPublicKey: jwt.Secret) {
      return new Promise((resolve, reject) => {
         jwt.verify(token, secretOrPublicKey, (err, decoded) => {
            if (err) reject(Error(`Error with token: ${err.message}`));
            else resolve(decoded);
         });
      });
   }
}

export default Jwt;
