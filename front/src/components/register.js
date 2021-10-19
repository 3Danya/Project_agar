import { useState } from "react"
import { connect } from "react-redux"
import {actionFullRegister} from "../redux/actions.js"
import {Redirect} from 'react-router-dom';

export default connect(store => ({loggedIn:store.authReducer?.token}),{onRegister:actionFullRegister})(({loggedIn,onRegister}) => {
    const [login,setLogin] = useState("")
    const [password,setPassword] = useState("")
    const [cPassword,setCPassword] = useState("")
    const [birthday,setbirthday] = useState("")
    const [passwordCheck,setPasswordCheck] = useState(false)
    return(
        <main className = "main">
            <div className = "login mx-auto col-xl-8">
                <div className = "login-form">
                    <h3>Registration</h3>
                    <h5 className = "login-h">Login</h5>
                    <input className = "auth-input" value = {login} onChange = {(e) => setLogin(e.target.value)}/>
                    <h5 className = "login-h">Password</h5>
                    <input className = "auth-input" type = "password" value = {password} onChange = {(e) => {setPassword(e.target.value)}}/>
                    <h5 className = "login-h">Confirm your password</h5>
                    <input className = "auth-input" type = "password" value = {cPassword} onChange = {(e) => setCPassword(e.target.value)}/>
                    <h5 className = "login-h">Date Of Birth</h5>
                    <input type = "date" value = {birthday} placeholder = 'Не обязательно' onChange = {(e) => setbirthday(e.target.value)}/>
                    <button className = "login-btn" onClick = {() => {(cPassword == password) && (birthday ? onRegister(login,password,birthday) : onRegister(login,password,'2000.01.01')) || (setPasswordCheck(true))}}>Register</button>
                    {passwordCheck && <p>Пароли не совпадают</p>}
                    {loggedIn && <Redirect to = '/profile'/>}
                </div>
            </div>
        </main>
    )
})