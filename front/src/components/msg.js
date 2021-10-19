export default ({text}) =>{
    return(
            text.map((text) => 
            <div key = {text.msgid} className = "msg-holder">
                <span className = 'msg'>
                    <img className = "chat-avatar" src = {`http://109.86.248.165:12123/images/${text.user.img}.jpg`}></img>{text.user.username + '   :   ' + text.message}
                </span>
            </div>)
    )
}