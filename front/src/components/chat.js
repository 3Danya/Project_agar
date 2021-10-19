// import { useState } from "react"
// import { connect } from 'react-redux';
// import io from 'socket.io-client'
// import Msg from './msg.js'

// export default connect(store => ({nick:store.authReducer?.payload?.username}),null)(({nick}) => {
//     const [msg,setMsg] = useState("")
//     const [msgs,setMsgs] = useState([])
//     socket.on('msg',(m)=>setMsgs([...msgs,m]))
//     return(
//         <main className = "main">
            
//         </main>
        
//     )
// })