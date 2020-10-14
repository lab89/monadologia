import { RUNSTATE, State, StateFactory } from "../..";

const state: StateFactory = <StateFactory>function<T, S>(rf: <Q>(state: S)=> {value: T, state: Q}): State<T, S>{
    return {
        runState : rf,
        map : function<Q>(f: (value: T)=> Q): State<Q, ReturnType<typeof rf>['state']>{
            return state<Q, ReturnType<typeof rf>['state']>(function<P>(state: S){                
                const prev: {value: T, state: P} = this.runState(state);
                return {value: f(prev.value), state: prev.state}
            })
        },
        flatten : function(){
            return state<T, ReturnType<typeof rf>['state']>(function(state: S){
                const prev = this.runState(state);
                const i = prev.value.runState(prev.state);
                return i
            })
        }
    }
}

export default state;