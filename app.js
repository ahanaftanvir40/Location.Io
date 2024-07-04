import express from 'express'
import { Socket, Server } from 'socket.io'
import http from 'http'
import dotenv from 'dotenv'
import cors from cors
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config()


const app = express()

app.set('view engine', 'ejs')
app.set('views', join(__dirname, 'views'));
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(join(__dirname, 'public')))

const server = http.createServer(app)
const io = new Server(server)
const PORT = process.env.PORT

io.on("connection", (socket) => {
    socket.on('send-location', (data) => {
        console.log(data);
        io.emit('received-location', { id: socket.id, ...data })
    })
    console.log('user connected');
    socket.on('disconnect', () => {
        io.emit('user-disconnected', socket.id)
    })
})



app.get('/', (req, res) => {
    try {
        res.render('index');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})


server.listen(PORT, () => {
    console.log('server up');
})
