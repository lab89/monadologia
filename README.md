# monadologia
 A Functional Programming helper library

![grab-landing-page](https://github.com/lab89/monadologia/blob/master/images/monad.png)

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
```
```
<pipe>
pipe(Array<Function>)
or
monadologia.pipe(Array<Function>)

pipe(value)
or
monadologia.pipe(value)
```
```
<curry>
curry(Function)
or
monadologia.curry(Function)

curry(value1)(value2)..
or
monadologia.curry(value1)(value2)..
```
```
<go>
go(initValue, Array<Function>)
or
monadologia.go(initValue, Array<Function>)

go()
or
monadologia.go()
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
```
```
<reader>
interface Reader<T, E>{    
    runReader: (env?: E)=> T;
    map<Q>(f: (value: T)=> Q): Reader<Q, E>;
    chain<P>(f: (value: T)=> Reader<P, E>): Reader<P, E>;
    ask(): Reader<E, E>;
}
```
```
<task>
interface Task <T>{
    fork: (err: Function, ok: Function)=> void; 
    map<S>(f: (v: T)=> S): Task<S>;
    chain<S>(f: (v: T)=> Task<S>): Task<S>;
}
```

check detail usecase on example project!
