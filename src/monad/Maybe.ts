import { Maybe, MaybeFactory } from "../../index";

const maybe = <MaybeFactory>function(v: any): Maybe{
    return{
        isNothing : function(){
            return this.value === null || typeof this.value === 'undefined'
        },
        map : function(f: (...args: any[]) => any){
            return this.isNothing() ? maybe.nothing() : maybe(f(this.value));
        },
        flatten : function(){
            return this.value;
        },
        chain : function(f: Function){
            return this.map(f).flatten();
        },
        value: v
    }    
}
maybe.nothing = function(): Maybe{
    return{
        isNothing : function(){
            return true;
        },
        map : function(){
            return maybe.nothing();
        },
        flatten : function(){
            return maybe.nothing();
        },
        chain : function(){
            return maybe.nothing();
        },
        value: null
    }
}

export default maybe;