import express from 'express'
import { Socket, Server } from 'socket.io'
import http from 'http'
import dotenv from 'dotenv'
dotenv.config()


const app = express()

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

const server = http.createServer(app)
const io = new Server(server)
const PORT = process.env.PORT

io.on("connection", (socket) => {
    socket.on('send-location', (data) => {
        console.log(data);
        io.emit('received-location', { id: socket.id , ...data })
    })
    console.log('user connected');
    socket.on('disconnect' , ()=>{
        io.emit('user-disconnected' , socket.id)
    })
})



app.get('/', (req, res) => {
    res.render('index')
})


server.listen(PORT, () => {
    console.log('server up');
})
