const curry = (fn: Function, length: Number = fn.length) => {
    return (...args: Array<any>) => {
        return args.length >= length? fn(...args) : curry((...nextArgs: Array<any>) => fn(...args, ...nextArgs), fn.length - args.length)
    }
}

export default curry;