import { ReturnInterator, FunctionsObject, createData, Errors } from './types';
/**
 *
 * @example
 *
 *
    //----------------any-file.ts-------------------------------
    import handleError from 'niceerror'
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
declare function niceError(errorsDictionary: Errors): (...others: any) => ReturnInterator;
declare function niceError(errorsDictionary: FunctionsObject, errors: Errors): (...others: any) => ReturnInterator;
/**
 *
 * @example
 *
 * //----------------config.ts-------------------------------
 *  import {create} from 'niceerror'
    export const handleError = create({
        dictionary: {
            'E001'() => 'ERRO 1',
            'E002': (name) => 'ERRO: '+name,
            'E003': () => 'ERRO 3 here',
        },
        onError(error){
            console.log(error.name, error.message)
        }
    })

 */
export declare const create: (data: createData) => typeof niceError;
export default niceError;
