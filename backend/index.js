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
    methods: ["POST", "GET"],
    credentials: true
}));
app.use(express.json())

app.use('/api/v1', router)

let groups = {}
let ready = {}

io.on("connection", (socket) => {
    console.log(socket.id + " joined")
    socket.on("create-room", () => {
        groups[socket.id] = [socket.id]
        socket.join(socket.id)
    })

    socket.on("join-room", ({ roomid }) => {
        if (!groups[roomid]) { return }
        socket.join(roomid)
        groups[roomid]?.push(socket.id)
    })

    socket.on("get-members", ({ roomid }) => {
        const members = groups[roomid] || []
        io.to(members).emit("group-members", { members })
    })

    socket.on("send-message", ({ roomid, message }) => {
        const members = groups[roomid] || []
        io.to(members).emit("receive-message", { message })
    })

    socket.on("send-video", ({ roomid, video }) => {
        let members = groups[roomid] || []
        members = members.filter(item => item !== roomid);
        io.to(members).emit("receive-video", { video })
        ready[roomid] = []
    })

    socket.on("we-are-ready", ({ roomid, id }) => {
        const members = groups[roomid] || []
        ready[roomid].push(id)
        if (ready[roomid].length == members.length) {
            io.to(members).emit("ready", {})
            console.log(" ready "+ready[roomid])
            ready[roomid] = []
        }
    })

    socket.on("pause-video", ({ roomid, id }) => {
        let members = groups[roomid] || []
        members = members.filter(item => item !== id)
        io.to(members).emit("pause", {})
    })

    socket.on("play-video", ({ roomid }) => {
        const members = groups[roomid] || []
        io.to(members).emit("play", {});
    })

    socket.on("disconnect", () => {
        for (let roomid in groups) {
            groups[roomid] = groups[roomid].filter(id => id !== socket.id)
            if (groups[roomid].length == 0) {
                delete groups[roomid];
                console.log(`Room ${roomid} deleted (empty)`);
            }
        }
    })
})

server.listen(3000, () => {
    console.log(`server started at port 3000`)
})