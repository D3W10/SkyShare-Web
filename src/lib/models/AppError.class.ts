import type { ErrorT } from "./ErrorT.type";

export class AppError extends Error {
    private _code: ErrorT;

    constructor(code: ErrorT, message?: string) {
        super(message ?? code);
        this._code = code;
    }

    get code() {
        return this._code;
    }
}