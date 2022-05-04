import { ReturnInterator, FunctionsObject, createData, Errors } from './types';
/**
 *
 * @example
 *
 *
    //----------------any-file.ts-------------------------------
    import handleError from 'snugerror'
    let errors = handleError({
        'E001': () => 'ERRO 1 local',
        'E002': (name) => 'ERRO '+name+' local'
    }, [
        function(data){
            if (!data) this.throw('E001') // will launch 'ERRO 1 local'
        },
        function(a, b){
            if (a !== b) this.throw('E002', a + b) // will launch 'ERRO: 4 local'
        },
        (data) => {
            if(!data?.name) throw new Error('Hello ERRO 3 here') // will launch 'ERRO 3 here'
        }
    ])
    //...
    const iterator = errors()

 */
declare function handleError(errorsDictionary: Errors): (...others: any) => ReturnInterator;
declare function handleError(errorsDictionary: FunctionsObject, errors: Errors): (...others: any) => ReturnInterator;
declare namespace handleError {
    var create: (data: createData) => typeof handleError;
}
export = handleError;
