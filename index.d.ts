export as namespace monadologia;
export type G<T> = (value: T) => T;
interface MaybeFactory {
    <T>(v: any): Maybe<T>;
    nothing<T>(): Maybe<T>;
}

interface Maybe<T> {
    isNothing(): boolean; 
    map<S>(f: (v: T)=> S): Maybe<S>; //M a -> (a -> b) -> M b
    flatten(): T | Maybe<T>; // M a -> a 
    chain<S>(f: (v: any) => Maybe<S>): Maybe<S>; // M a -> (a -> M b) -> M b
    value: T;
}

interface Either<T> {
    constructor<T>(v: T): Either<T>
    map<S>(f: (v: T) => S): Either<S>; //M a -> (a -> b) -> M b
    flatten(): T| Either<T>; // M a -> a 
    chain<S>(f: (v: any) => Either<S>): Either<S>; // M a -> (a -> M b) -> M b
    value: T;
    catch<S>(f: (v: any) => S): Either<S> | Either<T>
}

interface EitherFactory {
    right<T>(v: T): Either<T>;
    left<T>(v: T): Either<T>;
    tryCatch<T>(f: (v: any) => T): (v: any)=> Either<T>; // (()=>a) => M a
}

interface Task {
    fork: Function; 
    map(f: Function): Task; //M a -> (a -> b) -> M b // b: (err, ok)=> a(err, ok(f)) // sync
    chain(f: Function): Task; // M a -> (a -> M b) -> M b // b : (err, ok) => a(err, b(err, ok)) // async    
}

//<value, state>
interface State<T, S>{
    runState: <P>(state: P)=> {value: T, state: S}    
    map<Q>(f: (value: T)=> Q): State<Q, S>; // M <T, S> -> value -> Q -> M <Q, S>
    flatten<P, Q>(): State<P, Q>; 
    chain<P, Q>(f: (value: T)=> State<P, Q>): State<P, Q>// M<M<Q, S>, S> -> M<Q, S>
    evalValue(state: any): T // M<S, T> -> T
    evalState(state: any): S // M<T, S> -> S     
}

interface StateFactory{
    <T>(v: T) : State<T, any>;
    get(): State<any, any>; // M<T, S> -> M<Q, Q>
    put<P>(state: P): State<undefined, P>; // M<T, S> -> M<undefined, P>
    modify<P>(f: (state: any)=>P): State<undefined, P> // M<T, S> -> (S -> P) -> M<undefined, P>
    gets<P>(f: (state: any)=>P): State<P, any> // M<T, S> -> (S -> P) -> M<P, S> 
}

interface Writer<T>{
    value: T, // T
    log: any[], // any[]
    map<Q>(f: (value: T)=> Q): Writer<Q> // M<T, any[]> -> M<Q, any[]>
    flatten<P>(): Writer<P> | P, // M<T, any[]> -> T  or M<M<P, any[]>, any[]> -> M<P, any[] + any[]>
    chain<P>(f: (value: T)=> Writer<P>): Writer<P> // M<T, any[]> -> (T -> M<P, any[]>) -> M<P, any[] + any[]>
}

interface Reader<T>{
    runReader: <P>(env: P)=> T;
    map<Q>(f: (value: T)=> Q): Reader<Q>;
    chain<P>(f: (value: T)=> Reader<P>): Reader<P>;    
}

interface ReaderFactory{
    <T>(f: <P>(v: P)=> T): Reader<T>
    ask<T>(): Reader<T>;
}
export function pipe(...fns: Array<Function>): Function;
export function go(init: any, ...fns: Array<Function>): any;
export function curry(...fns: Array<Function>): Function;
export function compose(...fns: Array<Function>): Function;
export const maybe : MaybeFactory;
export const either: EitherFactory;
export const state: StateFactory;    