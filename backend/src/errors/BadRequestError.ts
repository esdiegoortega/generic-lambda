import { CustomError } from "./CustomError";
import { HttpStatusCode } from "./HttpStatusCode";

export class BadRequestError extends CustomError {

    constructor(message: string) {
        super(message, HttpStatusCode.BAD_REQUEST);
    }

    getLogError():string {
        return this.getMessage();
    }
}