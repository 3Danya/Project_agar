import { useEffect, useState } from "react"
import { connect } from "react-redux"
import {actionChangePassword,actionLogout} from "../redux/actions.js"

export default connect(store => ({isNewPassword:store.promiseReducer?.newPassword?.payload?.data?.newPassword}),{changePassword:actionChangePassword})(({isNewPassword,changePassword}) => {
    const [pasword,setPasword] = useState("")
    const [newPassword,setNewPassword] = useState("")
    const [nPassword,setNPassword] = useState(false)
    return(
        <main className = "main">
            <div className = "login mx-auto col-xl-8">
                <div className = "login-form">
                    <h3>Change Password</h3>
                    <h5 className = "login-h">Password</h5>
                    <input className = "auth-input" value = {pasword} onChange = {(e) => setPasword(e.target.value)}/>
                    <h5 className = "login-h">New password</h5>
                    <input className = "auth-input" value = {newPassword} onChange = {(e) => setNewPassword(e.target.value)}/>
                    <button className = "login-btn" onClick = {() => {
                        changePassword(pasword,newPassword)
                        isNewPassword && setNPassword('yes')
                        }}>Change</button>
                    {nPassword == 'yes' && <p>Пароль успешно изменен</p>}
                </div>
            </div>
        </main>
    )
})