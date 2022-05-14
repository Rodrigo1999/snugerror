
import * as utils from './utils'
import {ReturnInterator, contextFunctions, FunctionsObject, createData, Errors} from './types';

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

function handleError(errorsDictionary: Errors): (...others: any) => ReturnInterator 
function handleError(errorsDictionary: FunctionsObject, errors: Errors): (...others: any) => ReturnInterator 
function handleError(errorsDictionary: FunctionsObject | Errors, errors?: Errors): (...others: any) => ReturnInterator {

    const createContext = this || {}

    
    if(errorsDictionary && !errors && !createContext.dictionary){
        errors = errorsDictionary as Errors
        (errorsDictionary as any) = undefined

    }else if(errorsDictionary && !errors && createContext.dictionary){
        errors = errorsDictionary as Errors
        errorsDictionary = createContext.dictionary
        
    }else if (errorsDictionary && errors && createContext.dictionary){
        errorsDictionary = {...createContext.dictionary, ...errorsDictionary}
    }

    const methods = {
        throw(code: string, ...params){           
            if(errorsDictionary && errorsDictionary[code]){
                throw new (utils.CustomError as any)(code, errorsDictionary![code](...params))
            }else{
                throw new (utils.CustomError as any)(...Array.from(arguments))
            }
        }
    } as {
        throw: contextFunctions['throw']
    }

    function Interator(...others) {
        let index = 0

        const _this = this
        this.errors = []
        this.next = function () {
            try {

                let error = !this.position ? errors![index++] : errors![this.position]

                error.apply(Object.assign({params: others, errorName: error?.name}, {
                    message: typeof this.message !== 'function' ? this.message : undefined,
                    methods: {
                        next: this.next.bind(_this),
                        repeatNext: this.repeatNext.bind(_this),
                        error: this.error.bind(_this),
                        checkAll: this.checkAll.bind(_this),
                        message: _this.message,
                        errors: this.errors
                    },
                    throw: methods.throw
                }), Array.from(arguments))

            } catch (error){
                this.errors.push(error)
                if(createContext.onError) createContext.onError(error)
                throw error
            }
        }
        this.repeatNext = repeatCount => (...args) => {

            const messages = [].concat(this.message)
            let repeatPosition = 0;
            
            while ( repeatPosition++ < repeatCount ){
                this.next.apply({...this, message: messages[repeatPosition-1]}, args)
            }
        }
        this.message = function(message){

            const _this = Object.assign({}, this)
            const context = Object.assign({}, this, {message: [].concat(message)[0]})

            _this.next = _this.next.bind(context)
            _this.repeatNext = _this.repeatNext.bind(Object.assign({}, this, {message}))
            _this.error = _this.error.bind(context)
            return _this

        }
        this.error = position =>  (...args) => {

            let positionName = position
            if(typeof position == 'string' && errors){
                position = errors.findIndex((e: any) => e?.name == position)
            }
            if(!(position >= 0)) throw new Error(`Invalid position: ${positionName}`)

            return this.next.apply({params: others, ...methods, ...this, position}, args)
        }
        this.checkAll = function(...args){
            errors?.forEach(() => {
                this.next.apply({...this, message: this.message}, args)
            })
        }

        return this
    }
    
    return Interator.bind({})
}

/**
 * 
 * @example 
 * 
 * //----------------config.ts-------------------------------
 *  import snugerror from 'snugerror'
    export const handleError = snugerror.create({
        dictionary: {
            'E001': () => 'ERRO 1',
            'E002': (name) => 'ERRO: '+name,
            'E003': () => 'ERRO 3 here',
        },
        onError(error){
            console.log(error.name, error.message)
        }
    })

 */
const create = (data: createData) => handleError.bind(data)
handleError.create = create
export = handleError