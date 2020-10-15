import { State, StateFactory } from "../..";

const stateGen = function<T, S>(rf: <P>(state: P)=> {value: T, state: S}): State<T, S>{
    return {
        runState : rf,
        map : function<Q>(f: (value: T)=> Q): State<Q, S>{
            const runState = this.runState;
            return stateGen<Q, S>(function<S>(state: S){                
                const prev = runState(state);
                return {value: f(prev.value), state: prev.state}
            })
        },
        flatten : function<P, Q>(){
            const runState = this.runState;
            return stateGen<P, Q>(function<S>(state: S){
                const prev = runState(state);
                const i = prev.value.runState(prev.state); //? ?
                return i;
            })
        },
        chain : function<P, Q>(f: (value: T)=> State<P, Q>){            
            return this.map(f).flatten();
        },
        evalState : function(initState: any){
            const result = this.runState(initState);
            return result.state;
        },
        evalValue : function(initState: any){
            const result = this.runState(initState);
            return result.value;
        }
    }
}

const state: StateFactory = <StateFactory>function<T>(value : T): State<T, any>{
    return stateGen<T, any>(function(state: any){
        return {value: value, state: state}
    })
}
state.get = function(){
    return stateGen<any, any>(function<S>(state: S){
        return { value: state, state: state}
    })
},
state.put = function<P>(newState: P){
    return stateGen<undefined, P>(function(state: any){
      return {value: undefined as undefined, state: newState}
    })
},
state.modify = function<P>(f: (state: any)=> P){
    return this.get().chain(function(state: any){
        const newState = f(state);
        return this.put(newState)
    })
},
state.gets = function<P>(f: (state: any)=> P){
    return this.get().chain(function(state: any){
        const valFromState = f(state);
        return stateGen<P, any>(function(state: any){
            return {value: valFromState, state: state}
        })
    })
}
/**
const state2: StateFactory = <StateFactory>function<T, S>(rf: <P>(state: P)=> {value: T, state: S}): State<T, S>{
    return {
        runState : rf,
        map : function<Q>(f: (value: T)=> Q): State<Q, S>{
            const runState = this.runState;
            return state<Q, S>(function<S>(state: S){                
                const prev = runState(state);
                return {value: f(prev.value), state: prev.state}
            })
        },
        flatten : function<P, Q>(){
            const runState = this.runState;
            return state<P, Q>(function<S>(state: S){
                const prev = runState(state);
                const i = prev.value.runState(prev.state); //? ?
                return i;
            })
        },
        chain : function<P, Q>(f: (value: T)=> State<P, Q>){            
            return this.map(f).flatten();
        },
        evalState : function(initState: any){
            const result = this.runState(initState);
            return result.state;
        },
        evalValue : function(initState: any){
            const result = this.runState(initState);
            return result.value;
        },
        get : function(){
            return state<S, S>(function<S>(state: S){
                return { value: state, state: state}
            })
        },
        put : function<P>(newState: P){
            return state<undefined, P>(function<S>(state: S){
              return {value: undefined as undefined, state: newState}
            })
        },
        modify : function<P>(f: (v: S)=> P){
            return this.get().chain(function(state: S){
                const newState = f(state);
                return this.put(newState)
            })
        },
        gets : function<P>(f: (state: S)=> P){
            return this.get().chain(function(st: S){
                const valFromState = f(st);
                return state<P, S>(function(state: S){
                    return {value: valFromState, state: state}
                })
            })
        }
    }
}
 */
//generatorStore - local..

//storeFactory
//store
//get
//put
//modify
//gets
export default state;