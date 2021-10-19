import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import {actionLogout} from "../redux/actions.js"
import {Redirect} from 'react-router-dom';

export default connect(store => ({socket:store.agarReducer?.socket,loggedIn:store.authReducer?.token,nick:store.authReducer?.payload?.username}),{onLogout:actionLogout})(({socket,loggedIn,onLogout,nick}) => {
    socket.emit('leave')
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid col-xl-8">
                <h1 className="navbar-brand">Agar.io</h1>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                </ul>
                <ul className="navbar-nav">
                    {loggedIn ? <><li className="nav-item">
                        <a className = "pressed-button btn-padding" onClick = {() => onLogout()}>Logout</a>
                    </li>
                    <li className="nav-item">
                    <Link className = "pressed-button btn-padding" to = "/start" >Play agar.io</Link>
                    </li>
                    <li className="nav-item">
                        <Link className = "pressed-button btn-padding" to = "/profile">{nick}</Link>
                    </li></> : <><li className="nav-item">
                        <Link className = "pressed-button btn-padding" to = "/login">Login</Link>
                    </li>
                    <li className="nav-item">
                        <Link className = "pressed-button btn-padding" to = "/register">Register</Link>
                    </li></>}
                    {!loggedIn && <Redirect to = '/login'/>}
                </ul>
                </div>
            </div>
        </nav>
    )
})