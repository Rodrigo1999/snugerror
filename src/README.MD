# Niceerror

Niceerror é uma biblioteca que facilita as tratativas de erros de uma determinada rotina, ela foi criada
visando a separação do código voltado para regras de negócio e checkagem de erros.

# Instalação:

```bash
npm install niceerror
# or
yarn add niceerror
```

# Métodos:

## Exemplo básico com método next:

Aciona a próxima instrução para verificação de erro, inicia-se na posição 0 do array.

`.next(...args)`

```js
import handleError from 'niceerror'

let errors = handleError([
    function(data){
        // Sua rotina para validação dos dados aqui
        if (!data) throw new Error('You error: error 1')
    },
    function(a, b){
        // Sua rotina para validação dos dados aqui
        if (a !== b) throw new Error('Values is not equals')
    },
    (data) => {
        // Sua rotina para validação dos dados aqui
        if(!data?.name) throw new Error('Type yout name')
    }
])

...

app.get("/", (req, res) => {
    const iterator = errors()

    let data = {
        a: 1,
        b: 1,
        name: null
    }
    
    iterator.next(data)

    console.log('hello') // this console.log will running

    data.b = 3

    iterator.next(data.a, data.b) // will launch error 'Values is not equals'

    iterator.next(data)

    res.send('Hello World') // Essa resposta não será entregue
});
```
<hr/>
<!-- ----------------------------------------------------------------------------------------------------------------------------------------- -->

## Método repeatNext:

Repete a execução .next() a uma certa quantidade de vezes passada como argumento.

`.repeatNext(total_repeat)(...args)`

```js
import handleError from 'niceerror'

let errors = handleError([
    function(data){
        // Sua rotina para validação dos dados aqui
        if (!data) throw new Error('You error: error 1')
    },
    function(data){
        // Sua rotina para validação dos dados aqui
        if (data.a !== data.b) throw new Error('Values is not equals')
    },
    (data) => {
        // Sua rotina para validação dos dados aqui
        if(!data?.name) throw new Error('Type yout name')
    }
])

...

app.get("/", (req, res) => {
    const iterator = errors()

    let data = {
        a: 1,
        b: 1,
        name: null
    }

    iterator.repeatNext(3)(data) // Irá iterar na função 0, 1 e 2 do array

    res.send('Hello World') // Essa resposta não será entregue
});
```
<hr/>
<!-- ----------------------------------------------------------------------------------------------------------------------------------------- -->

## Método error:

Retorna um erro de uma posição específica, ou de uma função específica.

`.error(<position>)(...args)` <br/>
`.error(<name_function>)(...args)` <br/>

```js
import handleError from 'niceerror'

let errors = handleError([
    function (data){
        // Sua rotina para validação dos dados aqui
        if (!data) throw new Error('You error: error 1')
    },
    function check_id_user (data){
        // Sua rotina para validação dos dados aqui
        if(!data?.id) throw new Error('User id is not valid')
    },
    (a, b) => {
        // Sua rotina para validação dos dados aqui
        
        if (a !== b) throw new Error('Values is not equals')
    }    
])

...

app.get("/", (req, res) => {
    const iterator = errors()

    let data = {
        a: 1,
        b: 3,
        name: null
    }
    
    iterator.error(0)(data) // will launch <Error:  'You error: error 1'>

    iterator.error(2)(data.a, data.b) // will launch error 'Values is not equals'

    iterator.error('check_id_user')(data) // will launch <Error:  'User id is not valid'>

    res.send('Hello World') // Essa resposta não será entregue
});
```
<hr/>
<!-- ----------------------------------------------------------------------------------------------------------------------------------------- -->

<div id='message-method'>

## Método message:

Passa uma mensagem para o contexto da função.

`.message(<your message error>).error` <br/>
`.message(<your message error>).next` <br/>
`.message([<your message error 1>, <your message error 2>]).repeatNext` <br/>

```js
import handleError from 'niceerror'

let errors = handleError([
    function(data){
        // Sua rotina para validação dos dados aqui
        if (!data) throw new Error(this.message || 'Failed operation') // will launch <Error:  'You error: error 1'>
    },
    function(data){
        // Sua rotina para validação dos dados aqui
        if (!data) throw new Error(this.message || 'Failed operation') // will launch <Error:  'this is error 2'>
    },
    function(data){
        // Sua rotina para validação dos dados aqui
        if (!data) throw new Error(this.message || 'Failed operation') // will launch <Error:  'this is error 3'>
    },
])

...

app.get("/", (req, res) => {
    const iterator = errors()

    iterator.message('You error: error 1').next(undefined)
    iterator.message('You error: error 1').error(0)(undefined)
    iterator.message(['this is error 2', 'this is error 3']).repeatNext(2)(undefined) 

    res.send('Hello World') // Essa resposta não será entregue
});
```
<hr/>
</div>
<!-- ----------------------------------------------------------------------------------------------------------------------------------------- -->

## Método errors:

Retorna uma lista de erros emitido até a chamada dessa função.

```js
import handleError from 'niceerror'

let errors = handleError([
    function (data){
        // Sua rotina para validação dos dados aqui
        if (!data) throw new Error('You error: error 1')
    },
    function check_id_user (a, b){
        // Sua rotina para validação dos dados aqui
        if(!data?.id) throw new Error('User id is not valid')
    },
    (data) => {
        // Sua rotina para validação dos dados aqui
        if (a !== b) throw new Error('Values is not equals')
    }    
])

...

app.get("/", (req, res) => {
    
    const iterator = errors()

    try{
        iterator.next(undefined)
        iterator.next(1, 3)
        iterator.next({name: null})
    } catch (error){}

    console.log(iterator.errors) // [<uncaughtException>, <uncaughtException>, <uncaughtException>]
    ...
});
```
<hr/>
<!-- ----------------------------------------------------------------------------------------------------------------------------------------- -->

# Atributos:

## Passagem de parâmetros: `this.params`

Passa os parâmetros no construtor

```js
import handleError from 'niceerror'

let errors = handleError([
    function(data){
        console.log(this.params) // [{foo: 'bar'}, 'hello', 'world', 1]
        ...
    },
    function(a, b){
        const [obj, var_1, var_2, var_3] = this.params

        console.log(obj) // {foo: 'bar'}
        console.log(var_1) // hello
        console.log(var_2) // world
        console.log(var_3) // 1
        ...
    }
])

...

app.get("/", (req, res) => {
    const iterator = errors({foo: 'bar'}, 'hello', 'world', 1)
    ...
});
```
<hr/>
<!-- ----------------------------------------------------------------------------------------------------------------------------------------- -->

## Retorno de mensagem: `this.message`

Retorna a mensagem passada na emissão do erro, veja <a href="#message-method">Método message</a>

<hr/>
<!-- ----------------------------------------------------------------------------------------------------------------------------------------- -->

## Nome da tratativa de erro/função: `this.errorName`

Retorna o nome da função lançadora de exceção, ou seja, o nome da tratativa de erro/função se preferir.

```js
import handleError from 'niceerror'

let errors = handleError([
    function check_payment(data){
        console.log(this.errorName) // check_payment
        ...
    },
    function verify_user_id(data){
        console.log(this.errorName) // verify_user_id
        ...
    }
])

...

app.get("/", (req, res) => {
    const iterator = errors()
    ...
});
```
<hr/>
<!-- ----------------------------------------------------------------------------------------------------------------------------------------- -->

## Retorno de métodos: `this.methods`

Retorna todos os métodos

```js
import handleError from 'niceerror'

let errors = handleError([
    function check_payment(data){
        console.log(this.methods) // {next, repeatNext, error, errors, message}
        ...
    }
])

...

app.get("/", (req, res) => {
    const iterator = errors()
    ...
});
```
<hr/>
<!-- ----------------------------------------------------------------------------------------------------------------------------------------- -->

## Atributo trhow: `this.trhow`

Lança uma excessão.

`this.trhow(<error_name>, <error_message>)` <br/>
or <br/>
`this.trhow(<error_message>)`

```js
import handleError from 'niceerror'

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
...

app.get("/", (req, res) => {
    const iterator = errors()
    ...
});
```
<hr/>
<!-- ----------------------------------------------------------------------------------------------------------------------------------------- -->


# Outras configurações:

## Erros com dicionário:

```js
import handleError from 'niceerror'

let errors = handleError({
    'E001': () => 'Example error 1',
    'E002': (a, b) => `Values is not equals: ${a} !== ${b}`
}, [
    function(data){
        // Sua rotina para validação dos dados aqui
        if (!data) this.throw('E001') // will launch <E001: 'Example error 1'>
    },
    function(a, b){
        // Sua rotina para validação dos dados aqui
        if (a !== b) this.throw('E002', a, b) // will launch <E002: 'Values is not equals: 1 !== 3'>
    },
    (data) => {
        // Sua rotina para validação dos dados aqui
        if(!data?.name) throw new Error('Type yout name') // will launch <Error: 'Type yout name'>
    }
])

...

app.get("/", (req, res) => {
    const iterator = errors()

    let data = {
        a: 1,
        b: 1,
        name: null
    }
    
    iterator.next(data)

    console.log('hello') // this console.log will running

    data.b = 3

    iterator.next(data.a, data.b) // will launch error 'Values is not equals'

    iterator.next(data)

    res.send('Hello World') // Essa resposta não será entregue
});
```
<hr/>
<!-- ----------------------------------------------------------------------------------------------------------------------------------------- -->

## Método create:

Dessa forma é possível configurar um dicionário de mensagem de erros e um ouvinte de excessões.

```js

//----------------config.ts-------------------------------
import {create} from 'niceerror'

export const handleError = create({
    dictionary: {
        'E001': () => 'Example error 1',
        'E002': (a, b) => `Values is not equals: ${a} !== ${b}`
        'E003': () => 'ERRO 3 here',
    },
    onError(error){
        console.log(error.name, error.message)
    }
})

//----------------any-file.ts-------------------------------

let errors = handleError([
    function(data){
        // Sua rotina para validação dos dados aqui
        if (!data) this.throw('E001') // will launch <E001: 'Example error 1'> Obs.: error by dictionary in config.ts
    },
    function(a, b){
        // Sua rotina para validação dos dados aqui
        if (a !== b) this.throw('E002', a, b) // will launch <E002: 'Values is not equals: 1 !== 3'> Obs.: error by dictionary in config.ts
    },
    (data) => {
        // Sua rotina para validação dos dados aqui
        if(!data?.name) throw new Error('Type yout name') // will launch <Error: 'Type yout name'>
    }
])

...

app.get("/", (req, res) => {
    const iterator = errors()

    let data = {
        a: 1,
        b: 1,
        name: null
    }
    
    iterator.next(data)

    console.log('hello') // this console.log will running

    data.b = 3

    iterator.next(data.a, data.b) // will launch error 'Values is not equals'

    iterator.next(data)

    res.send('Hello World') // Essa resposta não será entregue
});
```
<hr/>
<!-- ----------------------------------------------------------------------------------------------------------------------------------------- -->

## Método create e dicionário local:

É possível rescrever certos items do dicionário caso eu passe um dicionário local.

```js

//----------------config.ts-------------------------------
import {create} from 'niceerror'

export const handleError = create({
    dictionary: {
        'E001': () => 'Example error 1',
        'E002': (a, b) => `Values is not equals: ${a} !== ${b}`
        'E003': () => 'ERRO 3 here',
    },
    onError(error){
        console.log(error.name, error.message)
    }
})

//----------------any-file.ts-------------------------------

let errors = handleError({
    'E001': () => 'Example error 1, hello i am a local error',
    'OTHER': (a, b) => `Hello, data are bad`,
},[
    function(data){
        // Sua rotina para validação dos dados aqui
        if (!data) this.throw('E001') // will launch <E001: 'Example error 1, hello i am a local error'> Obs.: error by local dictionary
    },
    function(a, b){
        // Sua rotina para validação dos dados aqui
        if (a !== b) this.throw('E002', a, b) // will launch <E002: 'Values is not equals: 1 !== 3'> Obs.: error by dictionary in config.ts
    },
    (data) => {
        // Sua rotina para validação dos dados aqui
        if(!data?.name) this.throw('OTHER') // will launch <OTHER: 'Hello, data are bad'>
    }
])

...

app.get("/", (req, res) => {
    const iterator = errors()

    let data = {
        a: 1,
        b: 1,
        name: null
    }
    
    iterator.next(data)

    console.log('hello') // this console.log will running

    data.b = 3

    iterator.next(data.a, data.b) // will launch error 'Values is not equals'

    iterator.next(data)

    res.send('Hello World') // Essa resposta não será entregue
});
```
<hr/>
<!-- ----------------------------------------------------------------------------------------------------------------------------------------- -->