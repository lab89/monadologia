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
type RUNSTATE<P, Q> = <S>(state: S)=> {value: P, state: Q}
interface State<T, S>{
    runState: <Q>(state: S)=> {value: T, state: Q}
    
    map<Q>(f: (value: T)=> Q): State<Q, ReturnType<RUNSTATE<T, S>>['state']>; // M <T, S> -> value -> Q -> M <Q, S>
    
    flatten(): 
    State<T, ReturnType<RUNSTATE<T, ReturnType<RUNSTATE<T, S>>['state']>>['state']> 
    
    // M<M<Q, S>, S> -> M<Q, S>
    
    // chain<P, Q>(f: (value: T)=> State<P, Q>): 
    // State<ReturnType<RUNSTATE<ReturnType<RUNSTATE<P, Q>>['value'], ReturnType<RUNSTATE<P, Q>>['state']>>['value'], 
    // ReturnType<RUNSTATE<ReturnType<RUNSTATE<P, Q>>['value'], ReturnType<RUNSTATE<P, Q>>['state']>>['state']> ; 
    // // M <T, S> -> value -> M<Q, S> -> M<Q, S>


    // evalValue<T, S>(f: ()=> {value: T, state: S}): T // M<S, T> -> T
    // evalState(state: any): // M<T, S> -> runState<P, Q> -> Q;    
    // get<P, Q>(): State<P, Q>;
    // put<undefined, P>(v: P): State<undefined, P>;
    // modify<undefined, Q>(f: (v: S)=>{value: any, state: Q}): State<undefined, Q>
    //gets(f: (v: S)=>): State<any, any>
}
interface StateFactory {
    <T, S>(f: <Q>(state: any)=>{value: T, state: Q}): State<T, S>;    
}
export function pipe(...fns: Array<Function>): Function;
export function go(init: any, ...fns: Array<Function>): any;
export function curry(...fns: Array<Function>): Function;
export function compose(...fns: Array<Function>): Function;
export function maybe<T>(v: T): Maybe<T>;
export const either: EitherFactory;
export function state<T, S>(f: (state: any)=>{value: T, state: S}): State<T, S>;    