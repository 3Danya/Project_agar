const Sequelize = require('sequelize');
const sequelize = new Sequelize("test", "root", "12345",{
    dialect: "mysql",
    host: "localhost"
  });

const {graphqlHTTP:express_graphql} = require('express-graphql');
const { buildSchema } = require('graphql');

const jwt             = require('jsonwebtoken')
const SECRET          = "big big secret"

const cors = require('cors')
const express = require('express')
const app = express()

const http = require('http').createServer(app);
const io = require("socket.io")(http);

const fs = require('fs')

app.use(express.static('public'));

app.use(cors())

app.post('/upload', async(req, res) => {
    let decoded = jwt.verify(req.headers.token, SECRET)
    const thisUser = await User.findByPk(decoded.sub)

    let fileName = thisUser.username
    fileName     = `images/${fileName}`
    let fileStream = fs.createWriteStream('public/' + fileName + '.jpg');

    req.pipe(fileStream)
    req.on('end', () =>{
        res.end(JSON.stringify(fileName))
    })
})

const w = 3000
const h = 3000

class Player{
    constructor(x, y,size,speed,socketId,color,nick,token,canvW,canvH,vectorX,vectorY){
        this.x = x
        this.y = y
        this.size = size
        this.speed = speed
        this.socketId = socketId
        this.color = color || '#' + (Math.random().toString(16) + '000000').substring(2,8).toUpperCase()
        this.nick = nick
        this.token = token
        this.canvW = canvW
        this.canvH = canvH
        this.vectorX = vectorX
        this.vectorY = vectorY
    }
    canEat(p){
        return(
            Math.abs(this.x - p.x) < this.size - 5 && Math.abs(this.y - p.y) < this.size - 5 && this.size/p.size >= 1.6
        )
    }
}

class Food{
    constructor(x, y){
        this.x = x
        this.y = y
        this.size = 10
        this.color = '#' + (Math.random().toString(16) + '000000').substring(2,8).toUpperCase()
    }
    canBeEaten(p){
        return(
            Math.abs(this.x - p.x) < p.size && Math.abs(this.y - p.y) < p.size
        )
    }
}

let food = [];
let players = [];
let t = new Date().getTime()


setInterval(function(){
    if (food.length < 100){
        food.push(new Food(Math.floor(Math.random() * w), Math.floor(Math.random() * h)))
    }
    io.emit('foodEvery',{food})
}, 300)

setInterval(async() => {
    if(players){
        for(let player of players){
            if(player.x + player.speed * player.vectorX <= w && player.x + player.speed * player.vectorX >= 0){
                player.x += (player.speed * player.vectorX) * 0.6
            }
            if(player.y + player.speed * player.vectorY <= h && player.y + player.speed * player.vectorY >= 0){
                player.y += (player.speed * player.vectorY) * 0.6
            }
            io.to(`${player.socketId}`).emit("newParams",{player});
    
            food.forEach(function(food1){
                if(food1.canBeEaten(player)){
                    if(player.size <= 300){
                        player.size += 0.5
                        player.speed -= 0.007
                        io.to(`${player.socketId}`).emit("newParams",{player});
                    }
                    let index = food.indexOf(food1)
                    if(index > -1){
                        food.splice(index, 1)
                    }
                }
            })
            for(let p of players){
                if(p !== player){
                    if(player.canEat(p)){
                        player.size += p.size
                        player.speed -= 3 - p.speed
                        io.to(`${player.socketId}`).emit("newParams",{player});
                        if(player.size < 100){
                            players = players.filter((player) => player.socketId != p.socketId)
                            io.to(`${p.socketId}`).emit("lose",{players});
                        }
                    }
                }
            }
    
            if(player.size >= 100){
                io.emit('result',{players,winner:player})
                let playersArr = [...players]
                let t1 = new Date().getTime()
                let duration = (t1 - t)/1000;
                t = t1;
                ;(async() => {
                    const thisGame = await Game.create({duration})
                    for(let p of playersArr){
                        decoded = jwt.verify(p.token, SECRET)
                        const thisUser = await User.findByPk(decoded.sub)
                        await thisGame.addUser(thisUser, {through:{size:p.size}});
                    }
                })()
                players = []
                food = []
            }
        }
        io.emit('usersInfo',{players})
    }
},10)

io.on('connection', (socket) =>{
        let player;
        socket.on('join',async(data) => {
            players = players.filter((player) => player.nick != data.nick)
            player = new Player(Math.random() * w,Math.random() * h,20,3,socket.id,data.color,data.nick,data.token,data.canvW,data.canvH)
            players.push(player)
            socket.emit("newPlayer",{player})

            const messages = await Message.findAll({limit:15,order: [['updatedAt', 'DESC']]})
            let result = []
            for(let message of messages){
                const user = await message.getUser()
                result.push({message:message.message,msgid:message.id,user:{img:user.img,username:user.username}})
            }
            socket.emit('msgs',{result})
        })

        socket.on('newLayer' , (e) => {
            if(player){
                let a = e.layerX - player.canvW/2
                let b = e.layerY - player.canvH/2
                player.vectorX = Math.cos(Math.atan2(b,a))
                player.vectorY = Math.sin(Math.atan2(b,a))
            }
        })
        
        socket.on('disconnect', () =>{
                players = players.filter((player) => player.socketId != socket.id)
            }
        )
        socket.on('leave', () =>{
            players = players.filter((player) => player.socketId != socket.id)
        }
    )
        
        socket.on('sendMsg',async(data) =>{
            decoded = jwt.verify(data.token, SECRET)
            const thisUser = await User.findByPk(decoded.sub)
            await thisUser.createMessage({message:data.msg})
            const messages = await Message.findAll({limit:15,order: [['updatedAt', 'DESC']]})
            let result = []
            for(let message of messages){
                const user = await message.getUser()
                result.push({message:message.message,msgid:message.id,user:{img:user.img,username:user.username}})
            }
            io.emit('msgs',{result})
        })

    }
)

class User extends Sequelize.Model {
}

User.init({
    username: {type: Sequelize.STRING, unique: true},
  birthday: Sequelize.DATE,
  password: Sequelize.STRING,
  img:Sequelize.STRING,
}, { sequelize, modelName: 'user' });


class Message extends Sequelize.Model {
}

Message.init({
    message: Sequelize.TEXT
},{ sequelize, modelName: 'message' })

User.hasMany(Message)
Message.belongsTo(User)

class Game extends Sequelize.Model {

}

Game.init({
    duration: Sequelize.INTEGER
}, { sequelize, modelName: 'game' });

class UserToGame extends Sequelize.Model {

}

UserToGame.init({
    size:Sequelize.INTEGER
}, { sequelize, modelName: 'userToGame' });

User.belongsToMany(Game,{through: UserToGame})
Game.belongsToMany(User,{through: UserToGame})

const schema = buildSchema(`
    type Query {
        getGames(limit:Float!): [[Resarr]]
        login(username: String!, password: String!):String
    }

    type Mutation {
        register(username: String!, password: String!, birthday: String):User
        addImage(img:String!):User
        newPassword(password:String!,newPassword:String!):User
    }

    type Message {
        id: ID,
        message: String,
        createdAt: String,
        updatedAt: String

        user: User
    }

    type User {
        id: ID,
        username: String,
        age: Float,
        birthday: String,
        img:String,
    }

    type Game {
        id: ID,
        duration:Float

        user: User
    }

    type Resarr{
        name: String,
        size: Float,
        duration:String,
        id:String,
        img:String,
        time:String,
    }
`)

const resolvers = {
    async register({username, password, birthday}){
        return await User.create({username, password, birthday,img:"deffolt"})
    },
    async newPassword({password,newPassword},{thisUser}){
        if(thisUser.password == password){
            thisUser.password = newPassword
            await thisUser.save()
            return thisUser
        }else{
            return null
        }
    },
    async addImage({img},{thisUser}){
        thisUser.img = img
        await thisUser.save()
        return thisUser
    },
    async login({username, password}){
        if (!username || !password) return null;
        const user = await User.findOne({where: {username, password}})
        if (!user) return null;
        return jwt.sign({sub: user.id, username, birthday: user.birthday, img: user.img}, SECRET)
    },
    async getGames({limit}, {thisUser,jwt}){
        if (!thisUser) return null;
        const user = await User.findOne({where: {username:jwt.username}})
        let resultArr = [];
        const games = await user.getGames({limit,order: [['updatedAt', 'DESC']]})
        for(let game of games){
            let users = await game.getUsers()
            let gameArr = []
            for(let user of users){
                let size = user.userToGame.size
                let name = user.username
                gameArr.push({name,size,time:game.createdAt.getTime(),duration:game.duration,id:game.id,img:user.img})
            }
            resultArr.push(gameArr.sort((a,b) => b.size - a.size))
        }
        return resultArr
    }
}


function jwtCheck(req, secret) {
    const authorization = req && req.headers && req.headers.authorization 

    if (authorization && authorization.startsWith('Bearer ')){
        const token = authorization.substr("Bearer ".length)
        let decoded;
        try {
            decoded = jwt.verify(token, secret)
        }
        catch (e){
            return null;
        }
        return decoded
    }
}

app.use('/graphql', express_graphql(async (req, res) => {
    const jwt = jwtCheck(req, SECRET)
    if (jwt){
        const thisUser = await User.findByPk(jwt.sub)
        return ({
            schema, //jwt 
            rootValue: resolvers,
            graphiql: true,
            context: {jwt, thisUser}
        })
    }
    return ({
        schema, //anon
        rootValue: resolvers,
        graphiql: true,
    })
}));


sequelize.sync();
http.listen(5002)