declare function CustomError(name?: string, message?: string): Error;
declare namespace CustomError {
    var prototype: any;
    var __proto__: ErrorConstructor;
}
export { CustomError };
