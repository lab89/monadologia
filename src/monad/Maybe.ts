import { Maybe, MaybeFactory } from "../../index";

const maybe: MaybeFactory = <MaybeFactory>function<T>(v: T): Maybe<T>{
    return{
        isNothing : function(){
            return this.value === null || typeof this.value === 'undefined'
        },
        map : function(f: (v: T)=> any){
            return this.isNothing() ? maybe.nothing<null>() : maybe<ReturnType<typeof f>>(f(this.value));
        },
        flatten : function(): T{
            return this.value;
        },
        chain : function(f: (v: T) => Maybe<any>){
            return this.map(f).flatten();
        },
        value: v
    }    
}
maybe.nothing = function<T>(): Maybe<T>{
    return{
        isNothing : function(){
            return true;
        },
        map : function(){
            return maybe.nothing<T>();
        },
        flatten : function(){
            return this.value;
        },
        chain : function(){
            return maybe.nothing<T>();
        },
        value: null
    }
}

export default maybe;