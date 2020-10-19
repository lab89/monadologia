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



const mb = monadologia.maybe(4).maybeToEither();
console.log(mb);



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
.chain((v: any) => testFunc("A").catch((m: string)=> m))
.eitherToMaybe()
.maybeToEither()
console.log(afterRes) // either

console.log(monadologia.state)
// const s = monadologia.state<number, number>(3)
// .put((value: number)=> "hello")
// .modify((state: string)=> [])
// .evalState([])
// .modify((state: string)=>{
//     return []
// }).chain((v: undefined)=>{
//     return monadologia.state<number, number>(10)
// })


const s = monadologia.state<number>(3)
.chain((value: number)=> monadologia.state.put(999)) // value undefined state 999
.chain((value: undefined)=> monadologia.state.get<number>()) // value 999 state 999
.chain((value: number)=> monadologia.state.modify((state: number)=>{
    return [];
})) // value undefined state []
.chain((value: undefined)=>{
    return monadologia.state.gets((state: [])=> 200)
}) // value 200 state []
.chain((v: number)=> monadologia.state("뿅")) // value 뽕 state[] 
.evalValue(10) // init state 10, value return


console.log(s);

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

const w = monadologia.writer(4)
.map((v: number)=> "hello!")
.logging((v: string)=> "Inputed: " + v)
.chain((v: string)=> monadologia.writer(v, ["inputed: " + v]))
.map((v: string)=> "Yaho@")
.logging((v: string)=> "YAHO~~!")
console.log(w)

const t = monadologia.task<number>((err: Function, ok: Function)=>{
    ok(1)
}).chain((v: number)=> monadologia.task<string>((err: Function, ok: Function)=>{
    ok("")
})).map((v: string)=> 100)


t.fork(console.error, console.log)

const read1 = monadologia.reader<number, string>(100)
.map((v: number)=>{
    console.log(v); // 100
    return v + 200;
})
.map((v: number)=>{
    console.log(v) // 300
    return v + 40;
})

read1.chain((value: number)=>{
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



