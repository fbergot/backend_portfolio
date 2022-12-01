import * as http from "http";
import * as dotenv from "dotenv";
import utilsConnect from "./libs/utils/utilsConnect";
import app from "./app";

dotenv.config();

const server = http.createServer(app);
const port = utilsConnect.normalizePort("3000");

server.on("error", (err) => utilsConnect.errorHandler(err, server, port));
server.on("listening", () => console.log(`# Server ready #`));

server.listen(port, () => console.log(`Ready on port: ${port}`));
