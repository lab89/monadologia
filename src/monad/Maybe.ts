import {Either, Maybe, MaybeFactory } from "../../index";
import either from "../monad/Either"
const maybe: MaybeFactory = <MaybeFactory>function<T>(v: T): Maybe<T>{
    return{
        isNothing : function(){
            return this.value === null || typeof this.value === 'undefined'
        },
        map : function<S>(f: (v: T)=> S){
            return this.isNothing() ? maybe.nothing<null>() : maybe<S>(f(this.value));
        },
        flatten : function(): T{
            return this.value;
        },
        chain : function<S>(f: (v: T) => Maybe<S>| Either<S>): Maybe<S>{
            return this.map(f).flatten();
        },
        value: v,
        maybeToEither : function(){
            return this.isNothing()? either.left("no") : either.right(this.flatten())
        }
    }    
}
maybe.nothing = function<T>(): Maybe<T>{
    return{
        isNothing : function(){
            return true;
        },
        map : function<T>(){
            return maybe.nothing<T>();
        },
        flatten : function(){
            return maybe.nothing<T>();
        },
        chain : function<T>(){
            return maybe.nothing<T>();
        },
        value: null,
        maybeToEither : function(){
            return this.isNothing()? either.left("no") : either.right(this.flatten())
        }
    }
}

export default maybe;