import { Either, EitherFactory } from "../..";
function right<T>(v: T): Either<T> {
    return {
        constructor : right,
        map : function<S>(f: (v: T)=> any){
            return right<S>(f(this.value))
        },
        flatten : function(): T{
            return this.value;
        },
        chain : function<S>(f: (v: T) => S){
            return this.map(f).flatten();
        },
        catch : function(f: (v: any) => any){
            return right<ReturnType<typeof f>>(this.value)
        },
        value : v
    }
}
function left<T>(v: T): Either<T> {
    return {
        constructor : left,
        map : function(f: (v: T)=> any){
            return left<ReturnType<typeof f>>(this.value)
        },
        flatten : function(): T{
            return this.value;
        },
        chain : function<S>(f: (v: T) => S){
            return this.value;
        },
        catch : function(f: (v: any) => any){
            return right<ReturnType<typeof f>>(f(this.value))
        },
        value : v
    }
}

function tryCatch<S>(f: (v: any) => S): (v: any)=> Either<S> {
    return function(b: any): Either<ReturnType<typeof f>> {
        try{            
            return right<S>(f(b));
        }catch(error){
            return left<S>(error)
        }
    }
}

const either: EitherFactory = {
    right : right,
    left : left,
    tryCatch : tryCatch
}
export default either;