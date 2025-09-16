import { io } from "socket.io-client";

const Socket = io(import.meta.env.VITE_SOCKET_BACKEND,{
    autoConnect : true,
    transports : ['websocket']
})

export default Socket;