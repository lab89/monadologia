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
    flatten(): T; // M a -> a 
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

export function pipe(...fns: Array<Function>): Function;
export function go(init: any, ...fns: Array<Function>): any;
export function curry(...fns: Array<Function>): Function;
export function compose(...fns: Array<Function>): Function;
export function maybe<T>(v: T): Maybe<T>;
export const either: EitherFactory;