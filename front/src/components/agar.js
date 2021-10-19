import { useEffect, useRef, useState } from "react"
import { connect } from 'react-redux';
import Msg from './msg.js'

export default connect(store => ({socket:store.agarReducer?.socket,token:store.authReducer?.token,nick:store.authReducer?.payload?.username}),null)(({socket,token,nick,match:{params:{color}}}) => {
    const canv = useRef()
    const [modal,setModal] = useState(false)
    const [winner,setWinner] = useState('')
    const [msg,setMsg] = useState([])
    const [msgs,setMsgs] = useState([])
    const [mWidth,setMWidth] = useState(window.outerWidth - window.outerWidth/6)
    const [mHeight,setMHeignt] = useState(window.outerHeight - window.outerHeight/6)
    const [usersTable,setUsersTable] = useState([])

    useEffect(() => {
        const ctx = canv.current.getContext('2d')
        const canvW = mWidth;
        const canvH = mHeight;
        const w = 3000
        const h = 3000

        let player;
        let food = [];
        let usersInfo;

        socket.emit('join',{color:color == 'red' && color || '#' + color,nick,token,canvW,canvH})

        socket.on('newPlayer',(playerObj) => {
            player = playerObj.player
        })
        
        socket.on('newParams',(updatedPlayer) => {
            player = updatedPlayer.player
        })

        socket.on('foodEvery',(foodBack) => {
            food = foodBack.food
        })

        socket.on('usersInfo',(users) => {
            usersInfo = users.players
            setUsersTable(usersInfo)
        })

        socket.on('msgs',(m)=>{
            setMsgs(m.result)
        })

        socket.on('lose',() => {
            window.location.reload()
        })

        socket.on('result',(playersResult) => {
            setWinner(playersResult.winner.nick)
            setModal(true)
        })

        update()
        
        let mouse = {layerX: 501, layerY:501};
        canv.current.addEventListener('mousemove', e => {
            let {layerX,layerY} = e
            socket.emit('newLayer',{layerX,layerY})
            mouse = e
        })
        ctx.scale(1,1)
        function move(){
                if(player){
                    let scaleIndex;
                    if(player.size <= 100){
                        scaleIndex = 20/player.size
                    }else{
                        scaleIndex = 20/100
                    }
                    ctx.setTransform(1,0,0,1,0,0)
                    ctx.clearRect(0,0,w,h);
                    ctx.scale(scaleIndex,scaleIndex)
                    ctx.translate((canvW/2/scaleIndex - player.x),(canvH/2/scaleIndex - player.y))
                    drawKletki()
                }
                update()
                window.requestAnimationFrame(move.bind(window,mouse))
            }
        
        move()
        function drawKletki(){
            for(let i = 0; i <= w; i += 75){
                ctx.beginPath()
                ctx.moveTo(i,0)
                ctx.lineTo(i,h)
                ctx.stroke()
            }

            for(let i = 0; i <= h; i += 75){
                ctx.beginPath()
                ctx.moveTo(0,i)
                ctx.lineTo(w,i)
                ctx.stroke()
            }
        }

        function drawCircle(x, y, size, color){
            ctx.fillStyle = color
            ctx.beginPath()
            ctx.arc(x, y, size, 0, 2 * Math.PI)
            ctx.fill()
        }

        function update(){
                food.forEach(function(food1){
                    drawCircle(food1.x, food1.y, food1.size, food1.color)
                })
                if(usersInfo){
                    for(let {x,y,size,color} of usersInfo){
                        drawCircle(x,y,size,color)
                    }
                }
        }
    },[])
    return(
        <>
            <main className = "main">
                <div className = "game mx-auto col-xl-8">
                    <div className = "canv-wrapper">
                        <canvas id="canvas" width = {mWidth} height = {mHeight} ref = {canv}></canvas>
                        <div className = 'leaderboard'>
                            <ol>
                                {usersTable.slice(0,9).sort((a,b) => b.size - a.size).map((user) => <li key = {user.nick}>{user.nick + " --- " + user.size + 'кг'}</li>)}
                            </ol>
                        </div>
                        <div className = 'chat-wrapper'>
                            <div><input value = {msg} onChange = {(e) => setMsg(e.target.value)}/></div>
                            <div><button onClick = {() => {
                                    msg && socket.emit('sendMsg',{msg,nick,token})
                                    setMsg("")
                                    }}>Отправить</button></div>
                            <div className = 'chat'>
                                <Msg text = {msgs}></Msg>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <div className = {modal ? 'modalW activeW' : 'modalW'}>
                <div className = "modal-msg">
                    <h3>{`Player ${winner} win!!!`}</h3>
                    <button className = "modal-btn" onClick = {() => {
                        setModal(!modal)
                        window.location.href = '/start'
                        }}>Play again</button>
                </div>
            </div>
        </>    
    )
})