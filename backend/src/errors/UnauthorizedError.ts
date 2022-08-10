import CustomError from "./CustomError";
import {HttpStatusCode} from "./HttpStatusCode";

class UnauthorizedError extends CustomError {

    constructor(message: string) {
        super(message, HttpStatusCode.UNAUTHORIZED);
    }

    getLogError():string {
        return this.getMessage();
    }
}

export default UnauthorizedError;