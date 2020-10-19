import { State, StateFactory } from "../..";

const stateGen = function<T, S>(f: (state: S)=> {value: T, state: S}): State<T, S>{
    return {
        runState : f,
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
        },
        // get: function(){
        //     return this.chain((value: T)=>{
        //         return stateGen<T, S>(function(state: S){
        //             return {value: value, state: state}
        //         })
        //     })
        // },
        // put: function<P>(f: (value: T) => P){
        //     console.log(f);
        //     return this.chain((value: T)=>{
        //         return stateGen<undefined, P>(function(state: P){
        //             return {value: undefined as undefined, state: f(value)}
        //           })
        //     })
        // },
        // modify: function<P>(f: (state: S)=> P){
        //     return this.chain((value: T)=>{
        //         return this.get().chain((state: S)=>{
        //             const newState = f(state);
        //             return this.put(() => newState)
        //         })
        //     })
        // },
        // gets: function<P>(f: (state: S) => P){
        //     return this.chain((value: T)=>{
        //         return this.get().chain(function(state: S){
        //             const valFromState = f(state);
        //             return stateGen<P, S>(function(state: S){
        //                 return {value: valFromState, state: state}
        //             })
        //         })
        //     })
        // }
    }
}

const state: StateFactory = <StateFactory>function<T>(value : T): State<T, any>{
    return stateGen<T, any>(function(state: any){
        return {value: value, state: state}
    })
}

state.get =  function(){
    return stateGen<any, any>(function<T>(state: any){
        return {value: state, state: state}
    })
},
state.put = function<P>(newState: P){
    return stateGen<undefined, P>(function(state: P){
        return {value: undefined as undefined, state: newState}
    })
},
state.modify =  function<P>(f: (state: any)=> P){
    return state.get().chain((st: any)=>{
        const newState = f(st);
        return state.put(newState)
    })
},
state.gets =  function<P>(f: (state: any) => P){
    return state.get().chain(function(state: any){
        const valFromState = f(state);
        return stateGen<P, any>(function(state: any){
            return {value: valFromState, state: state}
        })
    })
}


export default state;