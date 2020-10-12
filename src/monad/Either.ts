import { Either, EitherFactory } from "../..";
function right(v: any): Either {
    return {
        map : function(f: Function){
            return right(f(this.value))
        },
        flatten : function(){
            return this.value;
        },
        chain : function(f: Function){
            return this.map(f).flatten();
        },
        catch : function(f: Function){
            return right(this.value)
        },
        value : v
    }
}
function left(v: any): Either {
    return {
        map : function(f: Function){
            return left(this.value)
        },
        flatten : function(){
            return this.value;
        },
        chain : function(f: Function){
            return this.value;
        },
        catch : function(f: Function){
            return right(f(this.value))
        },
        value : v
    }
}

function tryCatch(f: Function): Function {
    return function (v: any): Either {
        try{
            return right(f(v));
        }catch(error){
            return left(error)
        }
    }
}

const either: EitherFactory = {
    right : right,
    left : left,
    tryCatch : tryCatch
}
export default either;