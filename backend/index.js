import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import http from 'http'
import { Server } from 'socket.io'
import router from './routes/Route.js'

dotenv.config()

const app = express()

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: [process.env.FRONTEND],
        credentials: true
    }
})

app.use(cors({
    origin: process.env.FRONTEND,
    methods: ["POST"],
    credentials: true
}));
app.use(express.json())

app.use('/api/v1', router)

let groups = {}

io.on("connection", (socket) => {
    socket.on("create-room", () => {
        groups[socket.id] = []
        socket.join(socket.id)
    })

    socket.on("join-room", ({ roomid }) => {
        if (!groups[roomid]) { return }
        socket.join(roomid)
        groups[roomid]?.push(socket.id)
    })

    socket.on("get-members", ({ roomid }) => {
        const members = groups[roomid]
        if (!members.includes(roomid)) {
            members.push(roomid)
        }
        for (let index = 0; index < members.length; index++) {
            io.to(members[index]).emit("group-members", { members })
        }
    })

    socket.on("send-message", ({ roomid, message }) => {
        const members = groups[roomid]
        for (let index = 0; index < members.length; index++) {
            io.to(members[index]).emit("receive-message", { message })
        }
    })

    socket.on("disconnect", () => {
        console.log(`${socket.id} was disconnected`)
        for (let roomid in groups) {
            groups[roomid] = groups[roomid].filter(id => id !== socket.id)
            if (groups[roomid].length == 0) {
                delete groups[roomid];
                console.log(`Room ${roomid} deleted (empty)`);
            }
        }
        console.log(JSON.stringify(groups))
    })
})

server.listen(3000, () => {
    console.log(`server started at port 3000`)
})