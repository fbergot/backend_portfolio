import * as http from "http";
import * as express from 'express';

/**
 * @class Utils
 */
class Utils {
    /**
     * Normalize port
     * @throw error if invalid port
     * @memberof Utils
     */
    public normalizePort(val: string | number): number {
        let port: undefined | number;
        if (typeof val === 'string') {
            if (isNaN(parseInt(val, 10))) {
                throw Error(`Invalid port`);
            } else {
                port = parseInt(val, 10);
            }           
        }
        if (port && port >= 0) {
          return port;
        }
        throw Error('Invalid port');
    }

    /**
     * log message of server listening
     * @memberof Utils
     */
    logHandler(port: number, server: http.Server): void {
        const address = server ? server.address() : undefined;
        const bind = typeof address === "string" ? `pipe: ${address}` : `port: ${port}`;
        console.log("listening on " + bind);
    }

    
    /**
     * For treatment errors
     * @memberof Utils
     */
    public errorHandler(error: any, server: http.Server, port: number): void {
        if (error.syscall !== 'listen') {
            throw error;
        }      
        var address = server.address();            
        var bind: string = typeof address === "string" ? `pipe: ${address}` : `port: ${port}`;

        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit();
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit();
            default:
                throw error;            
        }      
    }

    /**
     * Set the CORS headers
     * @memberof Utils
     */
    public setHeadersCORS(req: express.Request, res: express.Response, next: CallableFunction): void {
        res.setHeader('Access-Control-Allow-Origin', "*");
        res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        next();
    }

    /**
     * Take part after "Bearer " in authorization header
     * @memberof Utils
     */
    public getTokenInHeader(req: express.Request, errorMessage: string): string {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) throw Error(`${errorMessage}`);
        return token;
    }
}

const utilsInstance = new Utils;

export default utilsInstance;