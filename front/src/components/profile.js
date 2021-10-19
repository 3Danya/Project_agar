import {Link} from 'react-router-dom';
import { connect } from "react-redux"
import {actionStats,actionUploadImg,actionImg} from "../redux/actions.js"
import { useEffect,useState } from 'react';
import GameStats from './gameStats.js'
import Loader from './loader.js'

export default connect(store => ({nick:store.authReducer?.payload?.username,avatarImg:store.authReducer?.payload?.img,stats:store.promiseReducer?.stats?.payload?.data?.getGames || [],isStats:store.promiseReducer?.stats?.status}),{getStats:actionStats,img:actionUploadImg,setImg:actionImg})(({nick,getStats,stats,img,isStats,avatarImg,setImg}) => {
    const[l,setL] = useState(6)
    useEffect(() =>{
        getStats(l)
    },[l])
    return(
        <main className = "main">
                <div className = "games">
                        <div style = {{textAlign:"center"}}>
                            <h1>{`Hi ${nick}!`}</h1>
                            <div>
                                <img className = "profile-avtar" src = {`http://109.86.248.165:12123/images/${avatarImg}.jpg`}/>
                            </div>
                            <p>Сменить аватар</p>
                            <input type='file' onChange = {(e) => {
                                setImg(nick)
                                img(e.target.files[0])
                                window.location.reload()
                                }}/><br/>
                            <div className = 'link-wrapper'><Link className = 'link' to = '/changePassword' >Change Password</Link></div>
                            <h2>Your Games</h2>
                        </div>
                        <GameStats stats = {stats}/>
                        <div className = "pug-btn-wrapper">
                            {stats.length != 0 && <button className = "pressed-button" onClick = {() => setL(l + 9)}>Show more games</button> || <Link className = 'link' to = '/agar/red' >Play agar.io</Link>}
                        </div>
                </div>
        </main>
    )
})