import { useState } from "react"
import { connect } from "react-redux"
import {actionFullLogin} from "../redux/actions.js"
import {Redirect} from 'react-router-dom';
import Loader from './loader.js'

export default connect(store => ({loggedIn:store.authReducer?.token,tInfo:store.promiseReducer?.getToken?.payload?.data?.login,status:store.promiseReducer?.getToken?.status}),{onLogin:actionFullLogin})(({loggedIn,onLogin,tInfo,status}) => {
    const [login,setLogin] = useState("")
    const [password,setPassword] = useState("")
    const [trueInfo,setTrueInfo] = useState(true)
    return(
        <main className = "main">
            <div className = "login mx-auto col-xl-8">
                {status == 'PENDING'? <Loader /> :
                <div className = "login-form">
                    <h3>Authorization</h3>
                    <h5 className = "login-h">Login</h5>
                    <input className = "auth-input" value = {login} onChange = {(e) => setLogin(e.target.value)}/>
                    <h5 className = "login-h">Password</h5>
                    <input type = "password" className = "auth-input" value = {password} onChange = {(e) => setPassword(e.target.value)}/>
                    <button className = "login-btn" onClick = {() => {
                        login && password && onLogin(login,password)
                        setTrueInfo(false)
                        }}>Login</button>
                    {trueInfo ? <p style = {{opacity:0}}></p> : <p style = {{opacity:1}}>Неверный логин <br/> или пароль</p>}
                    {loggedIn && <Redirect to = '/profile'/>}
                </div>
                }
            </div>
        </main>
    )
})