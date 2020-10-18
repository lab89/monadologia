import { Either, EitherFactory, Maybe } from "../..";
import  maybe from "../monad/Maybe"
function right<T>(v: T): Either<T> {
    return {
        constructor : right,
        map : function<S>(f: (v: T)=> S){
            return right<S>(f(this.value))
        },
        flatten : function(): T{
            return this.value;
        },
        chain : function<S>(f: (v: T) => S){
            return this.map(f).flatten();
        },
        catch : function(f: (v: any) => any){
            return right<T>(this.value)
        },
        value : v,
        eitherToMaybe : function(){
            return maybe(this.catch((e: any)=> null as any).flatten());
        }
    }
}
function left<T>(v: T): Either<T> {
    return {
        constructor : left,
        map : function<S>(f: (v: T)=> S){
            return left<S>(this.value)
        },
        flatten : function(): T{
            return this.value;
        },
        chain : function<S>(f: (v: T) => S){
            return this.value;
        },
        catch : function<S>(f: (v: any) => S){
            return right<S>(f(this.value))
        },
        value : v,
        eitherToMaybe : function(){
            return maybe(this.catch((e: any)=> null as any).flatten());
        }
    }
}

function tryCatch<T>(f: (v: any) => T): (v: any)=> Either<T>{
    return function(b: any): Either<T>{
        try{            
            return right<T>(f(b));
        }catch(error){            
            return left<T>(error.message)
        }
    }
}


const either: EitherFactory = {
    right : right,
    left : left,
    tryCatch : tryCatch,
}
export default either;