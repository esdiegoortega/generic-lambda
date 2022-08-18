export abstract class CustomError extends Error {
    errorCode:Number;

    constructor(message: string, errorCode: Number) {
        super(message);
        this.errorCode = errorCode;
    }

    getMessage():string {
        return this.message;
    }

    getErrorCode(): Number {
        return this.errorCode;
    }

    abstract getLogError():string;
}