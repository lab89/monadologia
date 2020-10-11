const pipe = (...fns: Array<Function>) =>{
    return (v: any) => fns.reduce((res: any, fn: Function)=> fn(res), v)
}

export default pipe;