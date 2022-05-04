export interface ReturnInterator {
    /**
     *
     * Triggers the next instruction for error checking, starts at position 0 of the array.
     * @example
     *
     *
        //----------------any-file.ts-------------------------------
        import handleError from 'snugerror'

        let errors = handleError({
            'E001': () => 'ERRO 1 local',
            'E002': (name) => 'ERRO '+name+' local'
        }, [
            function (data){
                if (!data) this.throw('E001') // will launch 'ERRO 1 local'
            },
            function (a, b){
                if (a !== b) this.throw('E002', a + b) // will launch 'ERRO: 4 local'
            },
            (data) => {
                if(!data?.name) throw new Error('Hello ERRO 3 here') // will launch 'ERRO 3 here'
            }
        ])
        //...
        const iterator = errors()
        iterator.next(undefined) // will launch 'ERRO 1 local'
        iterator.next(1, 3) // will launch 'ERRO: 4 local'
        iterator.next({name: null}) // will launch 'Hello ERRO 3 here'

    */
    next: Function;
    /**
     * Returns a list of errors issued up to the call of this function.
     * @example
     *
     *
        //----------------any-file.ts-------------------------------
        import handleError from 'snugerror'

        let errors = handleError({
            'E001': () => 'ERRO 1 local',
            'E002': (name) => 'ERRO '+name+' local'
        }, [
            function (data){
                if (!data) this.throw('E001') // will launch 'ERRO 1 local'
            },
            function (a, b){
                if (a !== b) this.throw('E002', a + b) // will launch 'ERRO: 4 local'
            },
            (data) => {
                if(!data?.name) throw new Error('Hello ERRO 3 here') // will launch 'ERRO 3 here'
            }
        ])
        //...
        const iterator = errors()
        try{
            iterator.next(undefined) // will launch 'ERRO 1 local'
            iterator.next(1, 3) // will launch 'ERRO: 4 local'
            iterator.next({name: null}) // will launch 'Hello ERRO 3 here'
        } catch (error){}

        console.log(iterator.errors) // [<uncaughtException>, <uncaughtException>, <uncaughtException>]
    */
    errors: Array<Error>;
    /**
     * Repeats execution of .next() a certain number of times passed as an argument.
     * @example
     *
     *
        //----------------any-file.ts-------------------------------
        import handleError from 'snugerror'

        let errors = handleError({
            'E001': () => 'ERRO 1 local',
            'E002': (name) => 'ERRO '+name+' local'
        }, [
            function (data) {
                if (!data) this.throw('E001') // will launch 'ERRO 1 local'
            },
            function (data){
                if (data.a !== data.b) this.throw('E002', a + b) // will launch 'ERRO: 4 local'
            },
            (data) => {
                if(!data?.name) throw new Error('Hello ERRO 3 here') // will launch 'ERRO 3 here'
            }
        ])
        //...
        const iterator = errors()
        iterator.repeatNext(3)({a: 1, b: 1, name: null}) // repeat 'next' 3 times
        // 1 - check position 0 function
        // 2 - check position 1 function
        // 3 - check position 2 function and will launch 'Hello ERRO 3 here'
    */
    repeatNext: (repeatCount: number) => (...args: any) => never;
    /**
     * Passes a message to the functions context
     * @example
     *
     *
        //----------------any-file.ts-------------------------------
        import handleError from 'snugerror'

        let errors = handleError([
            function (data) {
                if (!data) throw new Error(this.message) // will launch 'Hello World'
            },
            () => {...}
        ])
        //...
        const iterator = errors()
        iterator.message('Hello World').next(undefined) // will launch 'ERRO 1 local'
    */
    message: (message: string | number | string[]) => ReturnInterator;
    /**
     * Returns an error from a specific position, or from a specific function: `.error(<position>, ...args)`
     * @example
     *
     *
        //----------------any-file.ts-------------------------------
        import handleError from 'snugerror'

        let errors = handleError([
            function (data) {
                if (!data) throw new Error(this.message) // will launch 'Hello World'
            },
            () => {
                throw new Error('Error 2')
            },
            function Error_3(a, b) {
                if (a !== b) throw new Error('Error 3') // will launch 'Error 3'
            },
            function Error_on_payment(data) {
                if (!data) throw new Error('Error on payment') // will launch 'Error on payment'
            },
        ])
        //...
        const iterator = errors()
        iterator.message('Hello World').error(0)(undefined) // will launch 'Hello World'
        iterator.error(2)('foo', 'bar') // will launch 'Error 3'
        iterator.error('Error_on_payment')(undefined) // will launch 'Error on payment'
    */
    error: (position: string | number) => (...args: any) => never;
}
export interface contextFunctions {
    methods: ReturnInterator;
    /**
     * throws an exception
     * @example
     *
     *
        //----------------any-file.ts-------------------------------
        import handleError from 'snugerror'

        let errors = handleError([
            function (data) {
                if (!data?.name) this.throw('E001', 'Here is a error') // `E001: Here is a error` instead of `Error: Here is a error`
            }
        ])

        // ----------------------------or---------------------------

        let errors = handleError([
            function (data) {
                if (!data?.name) this.throw('Here is a error') // `Error: Here is a error`
            }
        ])

        // ----------------------------or---------------------------

        let errors = handleError({
            'E001': (foo) => 'erro 1 '+foo
        }, [
            function (data) {
                if (!data?.name) this.throw('E001', 'here') // `E001: erro 1 here`
            }
        ])

        //...
        const iterator = errors()
        iterator.next({name: null})
    */
    throw: (code: string, ...args: any) => never;
    /**
    * Pass parameters in constructor
    * @example
    *
    *
       //----------------any-file.ts-------------------------------
       import handleError from 'snugerror'

       let errors = handleError([
           function (data) {
               console.log(this.params) // [{foo: 'bar'}, 'hello', 'world', 1]
               if (!data) throw new Error('Hello World') // will launch 'Hello World'
           }
       ])

       //...
       const iterator = errors({foo: 'bar'}, 'hello', 'world', 1)
       iterator.next()
   */
    params: Array<any>;
    /**
     * Returns the message passed when issuing the error
     * @example
     *
     *
        //----------------any-file.ts-------------------------------
        import handleError from 'snugerror'

        let errors = handleError([
            function (data) {
                if (!data) throw new Error(this.message) // will launch 'Hello World'
            },
            () => {...}
        ])
        //...
        const iterator = errors()
        iterator.message('Hello World').next(undefined) // will launch 'ERRO 1 local'
    */
    message: string | number | string[];
    /**
     * Returns the name of the exception-throwing function, ie the name of the error/function handle if you prefer.
     * @example
     *
     *
        //----------------any-file.ts-------------------------------
        import handleError from 'snugerror'

        let errors = handleError([
            function error_on_payment (data) {
                console.log(this.errorName) // "error_on_payment"
                if (!data) throw new Error('Hello World') // will launch 'Hello World'
            }
        ])

        //...
        const iterator = errors()
        iterator.next()
    */
    errorName: string;
}
export interface FunctionsObject {
    [x: string]: Function;
}
export interface createData {
    /**
     *
     * Creates a dictionary by default.
     * @example
     *
     * //----------------config.ts-------------------------------
     *  import snugerror from 'snugerror'
        export const handleError = snugerror.create({
            dictionary: {
                'E001'() => 'ERRO 1',
                'E002': (name) => 'ERRO: '+name,
                'E003': () => 'ERRO 3 here',
            }
        })
    */
    dictionary?: FunctionsObject;
    /**
     *
     * Callback function to listen for exceptions thrown.
     * @example
     *
     * //----------------config.ts-------------------------------
     *  import snugerror from 'snugerror'
        export const handleError = snugerror.create({
            onError(error){
                console.log(error.name, error.message)
            }
        })
    */
    onError?: (error: any) => void;
}
export declare type Errors = Array<(this: contextFunctions, ...args: any) => any>;
