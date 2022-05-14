# Snugerror

<p>
    Snugerror is a library that facilitates the handling of errors of a certain routine, it was created
    aimed at separating the code focused on business rules and error checking.
</p>

<p>
    We often need to write large data validation routines to throw errors, and this ends up getting mixed up with routines aimed at
    for business rules, making code reading bad. This reality drove the writing of this library.
</p>

# Installation:

```bash
npm install snugerror
# or
yarn add snugerror
```

## Methods:

### Basic example with next method:

Triggers the next instruction for error checking, starts at position 0 of the array.

`.next(...args)`

```js
import handleError from 'snugerror'

let errors = handleError([
    function(data){
        // Your routine for data validation here
        if (!data) throw new Error('You error: error 1')
    },
    function(a, b){
        // Your routine for data validation here
        if (a !== b) throw new Error('Values is not equals')
    },
    (data) => {
        // Your routine for data validation here
        if(!data?.name) throw new Error('Type your name')
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

    res.send('Hello World') // This answer will not be delivered
});
```
<hr/>
<!-- ----------------------------------------------------------------------------------------------------------------------------------------- -->

### Method repeatNext:

Repeats execution of .next() a certain number of times passed as an argument.

`.repeatNext(total_repeat)(...args)`

```js
import handleError from 'snugerror'

let errors = handleError([
    function(data){
        // Your routine for data validation here
        if (!data) throw new Error('You error: error 1')
    },
    function(data){
        // Your routine for data validation here
        if (data.a !== data.b) throw new Error('Values is not equals')
    },
    (data) => {
        // Your routine for data validation here
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

    iterator.repeatNext(3)(data) // Will iterate over function 0, 1 and 2 of the array

    res.send('Hello World') // This answer will not be delivered
});
```
<hr/>
<!-- ----------------------------------------------------------------------------------------------------------------------------------------- -->

### Error method:

Returns an error from a specific position, or from a specific function.

`.error(<position>)(...args)` <br/>
`.error(<name_function>)(...args)` <br/>

```js
import handleError from 'snugerror'

let errors = handleError([
    function (data){
        // Your routine for data validation here
        if (!data) throw new Error('You error: error 1')
    },
    function check_id_user (data){
        // Your routine for data validation here
        if(!data?.id) throw new Error('User id is not valid')
    },
    (a, b) => {
        // Your routine for data validation here
        
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
    
    iterator.error(0)(data) // will launch <Error: 'You error: error 1'>

    iterator.error(2)(data.a, data.b) // will launch <Error: 'Values is not equals'>

    iterator.error('check_id_user')(data) // will launch <Error: 'User id is not valid'>

    res.send('Hello World') // This answer will not be delivered
});
```
<hr/>
<!-- ----------------------------------------------------------------------------------------------------------------------------------------- -->

<div id='message-method'>

### Message method:

Passes a message to the function context.

`.message(<your message error>).error` <br/>
`.message(<your message error>).next` <br/>
`.message([<your message error 1>, <your message error 2>]).repeatNext` <br/>

```js
import handleError from 'snugerror'

let errors = handleError([
    function(data){
        // Your routine for data validation here
        if (!data) throw new Error(this.message || 'Failed operation') // will launch <Error:  'You error: error 1'>
    },
    function(data){
        // Your routine for data validation here
        if (!data) throw new Error(this.message || 'Failed operation') // will launch <Error:  'this is error 2'>
    },
    function(data){
        // Your routine for data validation here
        if (!data) throw new Error(this.message || 'Failed operation') // will launch <Error:  'this is error 3'>
    },
])

...

app.get("/", (req, res) => {
    const iterator = errors()

    iterator.message('You error: error 1').next(undefined)
    iterator.message('You error: error 1').error(0)(undefined)
    iterator.message(['this is error 2', 'this is error 3']).repeatNext(2)(undefined) 

    res.send('Hello World') // This answer will not be delivered
});
```
<hr/>
</div>
<!-- ----------------------------------------------------------------------------------------------------------------------------------------- -->

### Method errors:

Returns a list of errors issued up to the call of this function.

```js
import handleError from 'snugerror'

let errors = handleError([
    function (data){
        // Your routine for data validation here
        if (!data) throw new Error('You error: error 1')
    },
    function check_id_user (a, b){
        // Your routine for data validation here
        if(!data?.id) throw new Error('User id is not valid')
    },
    (data) => {
        // Your routine for data validation here
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
### Method checkAll:

Cycles through all error handling functions.

```js
import handleError from 'snugerror'

let errors = handleError([
    function (data){
        // Your routine for data validation here
        if (!data) throw new Error('You error: error 1')
    },
    function check_id_user (a, b){
        // Your routine for data validation here
        if(!data?.id) throw new Error('User id is not valid')
    },
    (data) => {
        // Your routine for data validation here
        if (a !== b) throw new Error('Values is not equals')
    }    
])

...

app.get("/", (req, res) => {
    
    const iterator = errors()
    iterator.checkAll(undefined)
    ...
});
```
<hr/>
<!-- ----------------------------------------------------------------------------------------------------------------------------------------- -->

## Attributes:

### Parameter passing: `this.params`

Pass parameters in constructor.

```js
import handleError from 'snugerror'

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

### Return message: `this.message`

Returns the message passed when the error was issued, see <a href="#message-method">message method</a>

<hr/>
<!-- ----------------------------------------------------------------------------------------------------------------------------------------- -->

### Error handler/function name: `this.errorName`

Returns the name of the exception-throwing function, ie the name of the error/function handle if you prefer.

```js
import handleError from 'snugerror'

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

### Method return: `this.methods`

Returns all methods.

```js
import handleError from 'snugerror'

let errors = handleError([
    function (data){
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

### Throw attribute: `this.throw`

Throw an exception.

`this.throw(<error_name>, <error_message>)` <br/>
or <br/>
`this.throw(<error_message>)`

```js
import handleError from 'snugerror'

let errors = handleError([
    function (data) {
        if (!data?.name) this.throw('E001', 'Here is a error') // <E001: Here is a error> instead of <Error: Here is a error>
    }
])

// ----------------------------or---------------------------

let errors = handleError([
    function (data) {
        if (!data?.name) this.throw('Here is a error') // <Error: Here is a error>
    }
])

// ----------------------------or---------------------------

let errors = handleError({
    'E001': (foo) => 'erro 1 '+foo
}, [
    function (data) {
        if (!data?.name) this.throw('E001', 'here') // <E001: erro 1 here>
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


## Other settings:

### Dictionary errors:

```js
import handleError from 'snugerror'

let errors = handleError({
    'E001': () => 'Example error 1',
    'E002': (a, b) => `Values is not equals: ${a} !== ${b}`
}, [
    function(data){
        // Your routine for data validation here
        if (!data) this.throw('E001') // will launch <E001: 'Example error 1'>
    },
    function(a, b){
        // Your routine for data validation here
        if (a !== b) this.throw('E002', a, b) // will launch <E002: 'Values is not equals: 1 !== 3'>
    },
    (data) => {
        // Your routine for data validation here
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

    res.send('Hello World') // This answer will not be delivered
});
```
<hr/>
<!-- ----------------------------------------------------------------------------------------------------------------------------------------- -->

### Create method:

In this way it is possible to configure an error message dictionary and an exception listener.

```js

//----------------config.ts-------------------------------
import snugerror from 'snugerror'

export const handleError = snugerror.create({
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
        // Your routine for data validation here
        if (!data) this.throw('E001') // will launch <E001: 'Example error 1'> Obs.: error by dictionary in config.ts
    },
    function(a, b){
        // Your routine for data validation here
        if (a !== b) this.throw('E002', a, b) // will launch <E002: 'Values is not equals: 1 !== 3'> Obs.: error by dictionary in config.ts
    },
    (data) => {
        // Your routine for data validation here
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

    res.send('Hello World') // This answer will not be delivered
});
```
<hr/>
<!-- ----------------------------------------------------------------------------------------------------------------------------------------- -->

### Create method and local dictionary:

It is possible to rewrite certain dictionary items if I pass a local dictionary.

```js

//----------------config.ts-------------------------------
import snugerror from 'snugerror'

export const handleError = snugerror.create({
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
        // Your routine for data validation here
        if (!data) this.throw('E001') // will launch <E001: 'Example error 1, hello i am a local error'> Obs.: error by local dictionary
    },
    function(a, b){
        // Your routine for data validation here
        if (a !== b) this.throw('E002', a, b) // will launch <E002: 'Values is not equals: 1 !== 3'> Obs.: error by dictionary in config.ts
    },
    (data) => {
        // Your routine for data validation here
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

    res.send('Hello World') // This answer will not be delivered
});
```
<hr/>
<!-- ----------------------------------------------------------------------------------------------------------------------------------------- -->