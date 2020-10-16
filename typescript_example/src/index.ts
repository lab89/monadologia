import * as monadologia from 'monadologia'
import { Maybe, MaybeFactory } from 'monadologia';


function a(v: any){
    console.log("call a func")
    return v;
}
function b(v: any){
    console.log("call b func")
    return v * v
}
function c(v: any){
    console.log("call c func")
    return v * v
}

const p = monadologia.pipe(a, b, c)(2)
console.log("PIPE : " + p)

const curried = monadologia.curry(function(a: any, b: any, c: any){
    console.log("CURRIED : " +  a, b, c)
})
curried(1)(2)(3)
curried(1, 2)(3)
curried(1)(2, 3)

const composed = monadologia.compose(a, b, c)
console.log("COMPOSED : " + composed(2));


console.log("MONADOLOGIA : ",  monadologia)

const result = monadologia.maybe<number>(4)
            .map((v: number)=> v * 4)
            .map((v: number)=> v + 2)
            .map((v: number)=> v + 5)
            .flatten(); //23

const result2 = 
monadologia.maybe<number>(4)
.map((v: number): number => v * 2)
.map((v: number)=> "20") 
.map((v: string)=> ({}) )
.map((v: {})=> [])
.map((v: any[])=> 100)
.map((v: number) => null as null)
.chain((v: number)=> monadologia.maybe<string>(""))
.chain((v: string)=> monadologia.maybe<string>(""))

console.log(result2) // nothing



const mb = monadologia.maybe(4)
console.log(monadologia.maybe.maybeToEither(mb));



function callback(v: string): string {
    if(v === "error") 
        throw new Error("error")
    return v;
}

const testFunc = monadologia.either.tryCatch<string>(callback)

const res = testFunc("test")
console.log(res.constructor.name) // right



const afterRes =res.catch((d: string) => d)
.map((v: string) => 10)
.map((v: number) => "")
.map((v: any) => testFunc("A").catch((m: string)=> m))
.chain((v: monadologia.Either<string>)=> monadologia.either.eitherToMaybe(v))
console.log(afterRes) // Maybe

console.log(monadologia.state)
const s = monadologia.state(3)
.chain((v: number)=> monadologia.state.put([]))
.chain((value: number)=> monadologia.state.gets((state: any)=> {   
    console.log("STATE : " , state); 
    return state + "hello"
}))
.evalValue("test")

console.log(s);


const w = monadologia.writer(4)
.map((v: number)=> "hello!")
.logging((v: string)=> "Inputed: " + v)
.chain((v: string)=> monadologia.writer(v, ["inputed: " + v]))
.map((v: string)=> "Yaho@")
.logging((v: string)=> "YAHO~~!")
console.log(w)

