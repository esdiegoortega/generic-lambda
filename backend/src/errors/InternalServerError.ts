import CustomError from "./CustomError";
import { v4 as uuid } from 'uuid';
import {HttpStatusCode} from "./HttpStatusCode";

class InternalServerError extends CustomError {
    private stacktrace: string;

    constructor(stacktrace: string) {
        let randomUuid:string =  uuid();
        let message: string = `Error general de la apliciación: ${randomUuid}`;
        super(message, HttpStatusCode.INTERNAL_SERVER);
        this.stacktrace = randomUuid + ": "+ stacktrace;
    }

    getStacktrace(): string {
        return this.stacktrace;
    }

    getLogError():string {
        return this.getStacktrace();
    }

}

export default InternalServerError;