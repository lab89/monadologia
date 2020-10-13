import { Either, EitherFactory } from "../..";
function right<T>(v: T): Either<T> {
    return {
        constructor : right,
        map : function<S>(f: (v: T)=> S){
            return right<ReturnType<typeof f>>(f(this.value))
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
        value : v
    }
}
function left<T>(v: T): Either<T> {
    return {
        constructor : left,
        map : function<S>(f: (v: T)=> S){
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

function tryCatch<T>(f: (v: any) => T): (v: any)=> Either<ReturnType<typeof f>> {
    return function(b: any): Either<ReturnType<typeof f>> {
        try{            
            return right<ReturnType<typeof f>>(f(b));
        }catch(error){
            return left<ReturnType<typeof f>>(error)
        }
    }
}

const either: EitherFactory = {
    right : right,
    left : left,
    tryCatch : tryCatch
}
export default either;