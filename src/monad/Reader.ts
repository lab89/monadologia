import { Reader, ReaderFactory } from "../.."

const readerGen = function<T, E>(f: (env: E)=> T): Reader<T, E>{
    return {
        runReader : f,
        map: function<P>(g: (value: T)=> P): Reader<P, E>{
            return readerGen((env: E)=> g(this.runReader(env)))
        },
        chain: function<P>(g: (value: T) => Reader<P, E>){
            return readerGen((env: E)=> g(this.runReader(env)).runReader(env))
        },
        ask: function(){
            return this.chain((env: E) => readerGen((x: E)=> x))
        }
    }
}

const reader: ReaderFactory = <ReaderFactory>function<T, E>(v: T): Reader<T, E>{
    return readerGen<T, E>(() => v)
}

export default reader;

