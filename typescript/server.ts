import * as http from 'http';
import * as dotenv from 'dotenv';
import utilsInstance from './class/Utils';
import app from "./app";

dotenv.config();

const server = http.createServer(app);
const port = utilsInstance.normalizePort(process.env.PORT || 3000);

server.on("error", (err) => utilsInstance.errorHandler(err, server, port));
server.on("listening", () => utilsInstance.logHandler(port, server));

server.listen(port);