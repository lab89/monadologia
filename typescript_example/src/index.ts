import * as monadologia from 'monadologia'


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

const result = monadologia.maybe(4)
            .map((v)=> v * 4)
            .map((v)=> v + 2)
            .map((v)=> v + 5)
            .flatten(); //23
const promise = () => new Promise((resolve, reject)=>{
    setTimeout(()=> resolve(1),1000)
})
const result2 = monadologia.maybe(4)
.map((v)=> v * 4)
.map(async (v)=> null)
.map((v)=> v + 5)
.flatten(); //16
console.log(result2);