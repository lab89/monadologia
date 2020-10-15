import { Writer, WriterFactory } from "../.."

const writerGen = function<T>(v: T, log: any[]): Writer<T>{
    return {
        value: v,
        log: log,
        map: function<Q>(f:(value: T)=> Q){                        
            return writerGen(f(v), this.log);
        },
        flatten: function<Q>(){
            console.log(this.value);
            return writerGen(this.value.value, this.value.log)
        },
        chain: function<Q>(f:(value: T)=> Writer<Q>){
            const res = this.map(f).flatten();
            console.log(res);
            return writerGen(res.value, this.log.concat(res.log));
        }
    }
}

const writer: WriterFactory = <WriterFactory>function<T>(v: T, l?: any[]){
    if(l){
        return writerGen(v, l)
    }else{
        return writerGen(v, [])
    }
    
}


export default writer