export as namespace monadologia;

interface MaybeFactory {
    <T>(v: T): Maybe<T>;
    nothing<T>(): Maybe<T>;
}

interface Maybe<T> {
    isNothing(): boolean; 
    map(f: (v: T)=> any): Maybe<ReturnType<typeof f>>; //M a -> (a -> b) -> M b
    flatten(): T; // M a -> a 
    chain(f: (v: T) => Maybe<any>): Maybe<ReturnType<typeof f>> | Maybe<any>; // M a -> (a -> M b) -> M b
    value: T;
}

interface Either<T> {
    constructor<T>(v: T): Either<T>
    map<S>(f: (v: T) => S): Either<S>; //M a -> (a -> b) -> M b
    flatten(): T; // M a -> a 
    chain<S>(f: (v: any) => S): S; // M a -> (a -> M b) -> M b
    value: T;
    catch(f: (v: any) => any): Either<ReturnType<typeof f>>
}

interface EitherFactory {
    right<T>(v: T): Either<T>;
    left<T>(v: T): Either<T>;
    tryCatch<T>(f: (v: T) => any): (v: any)=> Either<ReturnType<typeof f>>; // (()=>a) => M a
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