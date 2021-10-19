import { combineReducers } from "redux"
import io from 'socket.io-client'

const promiseReducer = function(state={}, {type, status, payload, error, name}){
    if (type === 'PROMISE'){
        if(status == 'PENDING' && name == 'stats' && state?.stats?.payload?.data?.getGames){
            return {
                ...state,
                [name]:{status, payload:state?.stats?.payload, error}
            }
        }else{
            return {
                ...state,
                [name]:{status, payload, error}
            }
        }
    }
    return state
}

const authReducer =  function(state, action){
    if (state === undefined){
        if(localStorage.token){
          action.token = localStorage.token
          action.type = 'LOGIN'
        }else{
          return {}
        }
    }
    if (action.type === 'LOGIN'){
        localStorage.token = action.token
        let {1:tokenAverage} = action.token.split('.')
        let decodedToken = atob(tokenAverage)
        let parsedToken = JSON.parse(decodedToken)
        return {token: action.token, payload: parsedToken}
    }
    if (action.type === 'LOGOUT'){
        localStorage.removeItem('token')
        return {}
    }
    return state
}

const agarReducer = function(state,action){
    const socket = io('http://109.86.248.165:12123', { transports: ['websocket', 'polling', 'flashsocket'] });
    return{
        socket
    }
    return state
}

export const rootReducer = combineReducers({
    promiseReducer,authReducer,agarReducer
})