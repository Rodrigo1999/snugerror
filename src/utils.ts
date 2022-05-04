function CustomError(name?: string, message?: string) {
    if(name && !message) {
        message = name
        name = undefined
    }

    var instance = new Error(message);
    instance.name = name || instance.name;
    Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
    if (Error && (Error as any).captureStackTrace) {
        (Error as any).captureStackTrace(instance, CustomError);
    }
    return instance;
}

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
} else {
    CustomError.__proto__ = Error;
}

export {CustomError}