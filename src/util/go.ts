import pipe from './pipe'
const go = (init: any, ...fns: Array<Function>) => pipe(...fns)(init)
export default go;