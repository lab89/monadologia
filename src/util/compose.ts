const compose = (...fns: Array<Function>) => {
    return (...args: Array<Function>) => fns.reduceRight((rest: Array<Function>, fn: Function)=> [fn.call(null, ...rest)], args)[0]
}

export default compose;