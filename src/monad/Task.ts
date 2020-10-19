import {Task, TaskFactory } from "../..";
import compose from '../util/compose'
const task: TaskFactory = <TaskFactory>function<T>(f: (err: Function, ok: Function) => void): Task<T>{
    return {
        fork : f,
        map : function(f: Function){
            return task((err: Function, ok: Function) => this.fork(err, compose(ok, f)));
        },
        chain : function(f: Function){
            return task((err: Function, ok: Function) => this.fork(err, (x: any) => f(x).fork(err, ok)))
        }
    }
}

export default task;