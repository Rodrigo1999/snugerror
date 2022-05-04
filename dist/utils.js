"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
function CustomError(name, message) {
    if (name && !message) {
        message = name;
        name = undefined;
    }
    var instance = new Error(message);
    instance.name = name || instance.name;
    Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
    if (Error && Error.captureStackTrace) {
        Error.captureStackTrace(instance, CustomError);
    }
    return instance;
}
exports.CustomError = CustomError;
CustomError.prototype = Object.create(Error.prototype, {
    constructor: {
        value: Error,
        enumerable: false,
        writable: true,
        configurable: true
    }
});
if (Object.setPrototypeOf) {
    Object.setPrototypeOf(CustomError, Error);
}
else {
    CustomError.__proto__ = Error;
}
