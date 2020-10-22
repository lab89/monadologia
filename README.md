# monadologia
 A Functional Programming helper library

![grab-landing-page](https://github.com/lab89/monadologia/blob/master/images/monad.png?raw=true)

> ## install
```
npm i monadologia
or
<script src="dist/monadologia"/>
```

> ## execute example
```
clone repository
cd typescript_example
npm i
npm run start
done!
```

> ## use
```
import {pipe, compose, either, maybe.. etx} from 'monadologia'
import * as monadologia from 'monadologia'

or
window.monadologia.pipe
window.monadologia.either..
```

> ## api
```
<compose>
compose(Array<Function>)
or
monadologia.compose(Array<Function>)

compose(value)
or
monadologia.compose(value)

example
function a(v: any){
    console.log("call a func")
    return v;
}
function b(v: any){
    console.log("call b func")
    return v * v
}
function c(v: any){
    console.log("call c func")
    return v * v
}
const composed = monadologia.compose(a, b, c);
console.log("COMPOSED : " + composed(2));
```
```
<pipe>
pipe(Array<Function>)
or
monadologia.pipe(Array<Function>)

pipe(value)
or
monadologia.pipe(value)

example
function a(v: any){
    console.log("call a func")
    return v;
}
function b(v: any){
    console.log("call b func")
    return v * v
}
function c(v: any){
    console.log("call c func")
    return v * v
}
const p = monadologia.pipe(a, b, c)(2);
console.log("PIPE : " + p);
```
```
<curry>
curry(Function)
or
monadologia.curry(Function)

curry(value1)(value2)..
or
monadologia.curry(value1)(value2)..

example
const curried = monadologia.curry(function(a: any, b: any, c: any){
    console.log("CURRIED : " +  a, b, c)
})
curried(1)(2)(3);
curried(1, 2)(3);
curried(1)(2, 3);
```
```
<go>
go(initValue, Array<Function>)
or
monadologia.go(initValue, Array<Function>)

go()
or
monadologia.go()

example
function a(v: any){
    console.log("call a func")
    return v;
}
function b(v: any){
    console.log("call b func")
    return v * v
}
function c(v: any){
    console.log("call c func")
    return v * v
}
const p = monadologia.go(2, a, b, c);
console.log("GO : " + p);

```
```
<maybe>

interface Maybe<T> {
    isNothing(): boolean; 
    map<S>(f: (v: T)=> S): Maybe<S>;
    flatten(): T | Maybe<T>;
    chain<S>(f: (v: T) => Maybe<S> | Either<S>): Maybe<S>;
    value: T;
    maybeToEither(): Either<T>
}

example

monadologia.maybe<number>(4)
    .map((v: number)=> v * 4)
    .chain((v: number)=> monadologia.maybe<string>(""))    
    .flatten(); // Some, ""
    
monadologia.maybe<number>(4)
    .map((v: number)=> v * 4)
    .chain((v: number)=> monadologia.maybe<string>(""))    
    .map((v: string) => null)
    .flatten(); // Nothing, null    
```
```
<either>

interface Either<T> {
    constructor<T>(v: T): Either<T>
    map<S>(f: (v: T) => S): Either<S>;
    flatten(): T| Either<T>;
    chain<S>(f: (v: T) => Either<S>| Maybe<S>): Either<S>;
    value: T;
    catch<S>(f: (v: any) => S): Either<S>
    catch(f: (v: any) => any): Either<T>
    eitherToMaybe<T>(): Maybe<T>
}
interface EitherFactory {
    right<T>(v: T): Either<T>;
    left<T>(v: T): Either<T>;
    tryCatch<T>(f: (v: any) => T): (v: any)=> Either<T>;
}

example
function callback(v: string): string {
    if(v === "error") 
        throw new Error("error")
    return v;
}

const testFunc = monadologia.either.tryCatch<string>(callback)

const res = testFunc("test") 

res.catch((d: string) => d)
.map((v: string) => 10)
.map((v: number) => "")
.chain((v: any) => testFunc("A").catch((m: string)=> m))
.flatten() // A

res.catch((d: string) => d)
.map((v: string) => 10)
.map((v: number) => "")
.chain((v: any) => testFunc("error").catch((m: string)=> m))
.flatten() // error
```
```
<state>

interface State<T, S>{
    runState: (state: S)=> {value: T, state: S}    
    map<Q>(f: (value: T)=> Q): State<Q, S>;
    flatten<P, Q>(): State<P, Q>;
    chain<P, Q>(f: (value: T)=> State<P, Q>): State<P, Q>
    evalValue(state: any): any
    evalState(state: any): any
}

interface StateFactory{
    <T, S>(v: T) : State<T, S>;
    <T>(v: T) : State<T, any>
    get<T>(): State<T, T> //muse input type(If the type is not entered, the type cannot be inferred from ide.)
    put<P>(newState: P): State<undefined, P> //muse input type(If the type is not entered, the type cannot be inferred from ide.)
    modify<P>(f: (state: any)=>P): State<undefined, P> //muse input type(If the type is not entered, the type cannot be inferred from ide.)
    gets<P>(f: (state: any) => P): State<P, any> //muse input type(If the type is not entered, the type cannot be inferred from ide.)
}

example
monadologia.state<number>(3)
.chain((value: number)=> monadologia.state.put(999)) // value undefined state 999
.chain((value: undefined)=> monadologia.state.get<number>()) // value 999 state 999
.chain((value: number)=> monadologia.state.modify((state: number)=>{
    return [];
})) // value undefined state []
.chain((value: undefined)=>{
    return monadologia.state.gets((state: [])=> 200)
}) // value 200 state []
.chain((v: number)=> monadologia.state("good")) // value 뽕 state[] 
.evalValue(10) // init state 10, value return

monadologia.state<number>(3)
.chain((value: number)=> monadologia.state.put(999)) // value undefined state 999
.chain((value: undefined)=> monadologia.state.get<number>()) // value 999 state 999
.chain((value: number)=> monadologia.state.modify((state: number)=>{
    return [];
})) // value undefined state []
.chain((value: undefined)=>{
    return monadologia.state.gets((state: [])=> 200)
}) // value 200 state []
.chain((v: number)=> monadologia.state("H")) // value H state[] 
.evalState(10) // init state 10, state return

```
```
<writer>
interface Writer<T>{
    value: T,
    log: any[],
    map<Q>(f: (value: T)=> Q): Writer<Q>
    flatten<P>(): Writer<P> | P 
    chain<P>(f: (value: T)=> Writer<P>): Writer<P>
    logging<Q>(f: (value: T) => Q): Writer<T>
}

example
monadologia.writer(4)
.map((v: number)=> "hello!")
.logging((v: string)=> "Inputed: " + v)
.chain((v: string)=> monadologia.writer(v, ["inputed: " + v]))
.map((v: string)=> "Yaho@")
.logging((v: string)=> "YAHO~~!")
```
```
<reader>
interface Reader<T, E>{    
    runReader: (env?: E)=> T;
    map<Q>(f: (value: T)=> Q): Reader<Q, E>;
    chain<P>(f: (value: T)=> Reader<P, E>): Reader<P, E>;
    ask(): Reader<E, E>;
}

const read = monadologia.reader<number, string>(100)
.map((v: number)=>{
    console.log(v); // 100
    return v + 200;
})
.map((v: number)=>{
    console.log(v) // 300
    return v + 40;
})

read.chain((value: number)=>{
   const newReader = monadologia.reader<number, string>(5)
   .ask()
   .map((v: string)=>{
       console.log(v) // test
       return v;
   }).
   map((v: string)=>{
       return 1
   })
   return newReader;
}).runReader("test")
```
```
<task>
interface Task <T>{
    fork: (err: Function, ok: Function)=> void; 
    map<S>(f: (v: T)=> S): Task<S>;
    chain<S>(f: (v: T)=> Task<S>): Task<S>;
}

monadologia.task<number>((err: Function, ok: Function)=>{
    ok(1)
}).chain((v: number)=> monadologia.task<string>((err: Function, ok: Function)=>{
    ok("")
})).map((v: string)=> 100)
t.fork(console.error, console.log)
```

check detail usecase on example project!
