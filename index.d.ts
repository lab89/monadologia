export as namespace monadologia;
interface Maybe {
    isNothing(): boolean; 
    map(f: (...args: any[]) => any): Maybe; //M a -> (a -> b) -> M b
    flatten(): any; // M a -> a 
    chain(f: Function): Maybe// M a -> (a -> M b) -> M b
    value: any;
}

interface MaybeFactory {
    (v: any): Maybe;
    nothing(): Maybe;
}

interface Either {
    map(f: (...args: any[]) => any): Either; //M a -> (a -> b) -> M b
    flatten(): any; // M a -> a 
    chain(f: Function): Either // M a -> (a -> M b) -> M b
    value: any;
    catch(f: Function): Either
}

interface EitherFactory {
    right(v: any): Either;
    left(v: any): Either;
    tryCatch(f: Function): Function; // (()=>a) => M a
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
export function maybe(v: any): Maybe;
export const either: EitherFactory;