import { Server } from "http";

class Utils_connection {
   /**
    * Normalize port
    * @throw error if invalid port
    * @memberof Utils
    */
   public static normalizePort(val: string | number): string {
      let port: undefined | number;
      if (typeof val === "string") {
         if (isNaN(parseInt(val, 10))) throw Error(`Invalid port`);
         else port = parseInt(val, 10);
      }
      if (port && port >= 0) {
         return `${port}`;
      }
      return "Port not correct";
   }

   /**
    * For treatment errors
    * @memberof Utils
    */
   public static errorHandler(error: any, server: Server, port: string): void {
      if (error.syscall !== "listen") {
         throw error;
      }
      var address = server.address();
      var bind: string = typeof address === "string" ? `pipe: ${address}` : `port: ${port}`;

      switch (error.code) {
         case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit();
         case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit();
         default:
            throw error;
      }
   }
}

export default Utils_connection;
