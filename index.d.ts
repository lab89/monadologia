export as namespace monadologia;
export type G<T> = (value: T) => T;
interface MaybeFactory {
    <T>(v: T): Maybe<T>;
    nothing<T>(): Maybe<T>;
}

interface Maybe<T> {
    isNothing(): boolean; 
    map<S>(f: (v: T)=> S): Maybe<S>; //M a -> (a -> b) -> M b
    flatten(): T | Maybe<T>; // M a -> a 
    chain<S>(f: (v: T) => Maybe<S> | Either<S>): Maybe<S>; // M a -> (a -> M b) -> M b
    value: T;
    maybeToEither(): Either<T>
}
interface Either<T> {
    constructor<T>(v: T): Either<T>
    map<S>(f: (v: T) => S): Either<S>; //M a -> (a -> b) -> M b
    flatten(): T| Either<T>; // M a -> a 
    chain<S>(f: (v: T) => Either<S>| Maybe<S>): Either<S>; // M a -> (a -> M b) -> M b
    value: T;
    catch<S>(f: (v: any) => S): Either<S>
    catch(f: (v: any) => any): Either<T>
    eitherToMaybe<T>(): Maybe<T>
}

interface EitherFactory {
    right<T>(v: T): Either<T>;
    left<T>(v: T): Either<T>;
    tryCatch<T>(f: (v: any) => T): (v: any)=> Either<T>; // (()=>a) => M a
}

interface Task <T>{
    fork: (err: Function, ok: Function)=> void; 
    map<S>(f: (v: T)=> S): Task<S>; //M a -> (a -> b) -> M b // b: (err, ok)=> a(err, ok(f)) // sync
    chain<S>(f: (v: T)=> Task<S>): Task<S>; // M a -> (a -> M b) -> M b // b : (err, ok) => a(err, b(err, ok)) // async    
    flatten<S>(): Task<S>;
}

interface TaskFactory {
    <T>(f: (err: Function, ok: Function)=>void): Task<T>;
    force<T>(value: T): Task<T>;
}

//<value, state>
interface State<T, S>{
    runState: (state: S)=> {value: T, state: S}    
    map<Q>(f: (value: T)=> Q): State<Q, S>; // M <T, S> -> value -> Q -> M <Q, S>
    flatten<T, S>(): State<T, S>; 
    chain<P, Q>(f: (value: T)=> State<P, Q>): State<P, Q>// M<M<Q, S>, S> -> M<Q, S>
    evalValue(state: S): T // M<S, T> -> T
    evalState(state: S): S // M<T, S> -> S
    get(): State<T, S>    
    put<P>(state: P): State<undefined, P>
    modify<P>(f: (state: S)=>P): State<undefined, P>
    gets<P>(f: (state: S) => P): State<P, S> 
}

interface StateFactory{
    <T, S>(v: T) : State<T, S>;
}

interface Writer<T>{
    value: T, // T
    log: any[], // any[]
    map<Q>(f: (value: T)=> Q): Writer<Q> // M<T, any[]> -> M<Q, any[]>
    flatten<P>(): Writer<P> | P, // M<T, any[]> -> T  or M<M<P, any[]>, any[]> -> M<P, any[] + any[]>
    chain<P>(f: (value: T)=> Writer<P>): Writer<P> // M<T, any[]> -> (T -> M<P, any[]>) -> M<P, any[] + any[]>    
    logging<Q>(f: (value: T) => Q): Writer<T> // M<T, any[]> (v - > v'), M<T, any[] + any[]>

}
interface WriterFactory{
    <T>(v: T) : Writer<T>
    <T>(v: T, l : any[]): Writer<T>
}
interface Reader<T, E>{    
    runReader: (env: E)=> T;
    map<Q>(f: (value: T)=> Q): Reader<Q, E>;
    chain<P>(f: (value: T)=> Reader<P, E>): Reader<P, E>;    
    ask(): Reader<E, E>;
}
interface ReaderFactory{
    <T, E>(v: T): Reader<T, E>
}



export function pipe(...fns: Array<Function>): Function;
export function go(init: any, ...fns: Array<Function>): any;
export function curry(...fns: Array<Function>): Function;
export function compose(...fns: Array<Function>): Function;
export const maybe : MaybeFactory;
export const either: EitherFactory;
export const state: StateFactory;    
export const writer: WriterFactory;
export const task: TaskFactory;
export const reader: ReaderFactory;