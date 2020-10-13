import * as monadologia from 'monadologia'
import { MaybeFactory } from 'monadologia';


function a(v: any){
    console.log("a")
    return v;
}
function b(v: any){
    console.log("b")
    return v * v
}
function c(v: any){
    console.log("c")
    return v * v
}

const p = monadologia.pipe(a, b, c)(2)
console.log("PIPE : " + p)

const curried = monadologia.curry(function(a: any, b: any, c: any){
    console.log(a, b, c)
})
curried(1)(2)(3)
curried(1, 2)(3)
curried(1)(2, 3)

const composed = monadologia.compose(a, b, c)
console.log(composed(2));


console.log(monadologia)
console.log()

const result = monadologia.maybe<number>(4)
            .map((v: number)=> v * 4)
            .map((v: number)=> v + 2)
            .map((v: number)=> v + 5)
            .flatten(); //23

const result2 = monadologia.maybe<number>(4)
.map((v: number)=> v * 2)
.chain((v: number)=>  (monadologia.maybe as MaybeFactory).nothing())
.map((v: number)=> v + 1)
.map((v: number)=> v + 1)
.flatten(); //16
console.log(result2);

function callback(v: string): string {
    if(v === "error") 
        throw new Error("v")
    return v;
}
const testFunc = monadologia.either.tryCatch<ReturnType<typeof callback>>(callback)

console.log(testFunc("test")) // right
console.log(testFunc("error")) // left

