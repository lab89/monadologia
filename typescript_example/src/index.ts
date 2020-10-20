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

console.log('%c pipe example! ', 'background: #222; color: #bada55');
const p = monadologia.pipe(a, b, c)(2)
console.log("PIPE : " + p)

console.log('%c curry example! ', 'background: #222; color: #bada55');
const curried = monadologia.curry(function(a: any, b: any, c: any){
    console.log("CURRIED : " +  a, b, c)
})
curried(1)(2)(3)
curried(1, 2)(3)
curried(1)(2, 3)

console.log('%c compose example! ', 'background: #222; color: #bada55');
const composed = monadologia.compose(a, b, c)
console.log("COMPOSED : " + composed(2));

console.log('%c monadologia ', 'background: #222; color: #bada55');
console.log("MONADOLOGIA : ",  monadologia)

console.log('%c maybe monad(some)example! ', 'background: #222; color: #bada55');
const result = 
monadologia.maybe<number>(4)
    .map((v: number)=> v * 4)
    .map((v: number)=> v + 2)
    .map((v: number)=> v + 5)
    .flatten(); //23
console.log(result)

console.log('%c maybe monad(nothing)example! ', 'background: #222; color: #bada55');
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

console.log('%c either monad example! ', 'background: #222; color: #bada55');
function callback(v: string): string {
    if(v === "error") 
        throw new Error("error")
    return v;
}

const testFunc = monadologia.either.tryCatch<string>(callback)

const res = testFunc("test")
console.log(res.constructor.name) // right


console.log('%c either monad tyrCath and eitherToMaybe, maybeToEither example '
, 'background: #222; color: #bada55');
const afterRes =res.catch((d: string) => d)
.map((v: string) => 10)
.map((v: number) => "")
.chain((v: any) => testFunc("A").catch((m: string)=> m))
.eitherToMaybe()
.maybeToEither()
console.log(afterRes.constructor.name) // either - right

console.log('%c state monad example!, evalValue ', 'background: #222; color: #bada55');
const s = monadologia.state<number>(3)
.chain((value: number)=> monadologia.state.put(999)) // value undefined state 999
.chain((value: undefined)=> monadologia.state.get<number>()) // value 999 state 999
.chain((value: number)=> monadologia.state.modify((state: number)=>{
    return [];
})) // value undefined state []
.chain((value: undefined)=>{
    return monadologia.state.gets((state: [])=> 200)
}) // value 200 state []
.chain((v: number)=> monadologia.state("good")) // value 뽕 state[] 
.evalValue(10) // init state 10, value return
console.log(s);

console.log('%c state monad example!, evalState ', 'background: #222; color: #bada55');
const s1 = monadologia.state<number>(3)
.chain((value: number)=> monadologia.state.put(999)) // value undefined state 999
.chain((value: undefined)=> monadologia.state.get<number>()) // value 999 state 999
.chain((value: number)=> monadologia.state.modify((state: number)=>{
    return [];
})) // value undefined state []
.chain((value: undefined)=>{
    return monadologia.state.gets((state: [])=> 200)
}) // value 200 state []
.chain((v: number)=> monadologia.state("뿅")) // value 뽕 state[] 
.evalState(10) // init state 10, state return
console.log(s1);

console.log('%c writer monad example', 'background: #222; color: #bada55');
const w = monadologia.writer(4)
.map((v: number)=> "hello!")
.logging((v: string)=> "Inputed: " + v)
.chain((v: string)=> monadologia.writer(v, ["inputed: " + v]))
.map((v: string)=> "Yaho@")
.logging((v: string)=> "YAHO~~!")
console.log(w)

console.log('%c task monad example', 'background: #222; color: #bada55');
const t = monadologia.task<number>((err: Function, ok: Function)=>{
    ok(1)
}).chain((v: number)=> monadologia.task<string>((err: Function, ok: Function)=>{
    ok("")
})).map((v: string)=> 100)
t.fork(console.error, console.log)

console.log('%c reader monad example', 'background: #222; color: #bada55');
const read1 = 
monadologia.reader<number, string>(100)
.map((v: number)=>{
    console.log(v); // 100
    return v + 200;
})
.map((v: number)=>{
    console.log(v) // 300
    return v + 40;
})

const r = read1.chain((value: number)=>{
    const newReader = monadologia.reader<number, string>(5).ask()
    .map((v: string)=>{
        console.log(v) // test
        return v;
    }).
    map((v: string)=>{
        return 1
    })
    return newReader;
}).runReader("test")

console.log(r)



