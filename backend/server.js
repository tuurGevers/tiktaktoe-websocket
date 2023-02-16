import express from "express";

const app = express()
import bodyParser from "body-parser"
import cors from "cors"

import {Server} from "socket.io";

app.use(cors({
    origin: 'http://198.177.124.166:5000',
    credentials: true,
    AccessControlAllowOrigin: 'http://198.177.124.166:5000',
    AccessControlAllowCredentials: true,
}));
const io = new Server({
    cors: {
        origin: "*",
        AccessControlAllowOrigin: '*',

    }
});


app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '10mb'}));
app.use(express.json())
app.use(express.static('public'));


app.get("/", (req, res) => {
    res.set('Access-Control-Allow-Origin', 'http://198.177.124.166:5000');
    res.set('Access-Control-Allow-Credentials', 'true');
    res.send("hello world")
})

let rooms = []
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('error', (err) => {
        console.log(err);
    });
    socket.on("create room", (data) => {
        createRoom(socket, data)
    })
    socket.on("join room", (data) => {
        joinRoom(socket, data)
    })
    socket.on("winner", (data) => {
        console.log(data.winner)
        socket.in("test game").emit("end game", data.winner)
    })
    socket.on("click", (body) => {
        let sendBody = body;
        const currentRoom = rooms.find((room) => room.code === body.room)
        sendBody.player = !currentRoom.player1
        rooms.find((room) => room.code === body.room).tiles[body.tile] = body.player ? "X" : "O"
        rooms.find((room) => room.code === body.room).player1 = !currentRoom.player1
        sendBody.tiles = rooms.find((room) => room.code === body.room).tiles
        io.in("test game").emit("cast click", sendBody)
        checkWin(rooms.find((room) => room.code === body.room).tiles, rooms.find((room) => room.code === body.room).code)
    })
});

function checkWin(tiles, roomID) {
    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
            if (tiles[y * 3] === tiles[y * 3 + 1] && tiles[y * 3 + 1] === tiles[y * 3 + 2]) {
                checkWinner(tiles[y * 3], roomID)
            } else if (tiles[y * 3 + x] === tiles[(y + 1) * 3 + x] && tiles[(y + 1) * 3 + x] === tiles[(y + 2) * 3 + x]) {
                checkWinner(tiles[y * 3+x], roomID)
            } else if ((tiles[0] === tiles[4] && tiles[0] === tiles[8]) || (tiles[2] === tiles[4] && tiles[2] === tiles[6])) {
                checkWinner(tiles[4], roomID)
            }
        }

    }
}

function checkWinner(tile,roomID) {

    switch (tile) {
        case "O": {
            io.in("test game").emit("game over", rooms.find((room) => room.code === roomID).player1)
            break;
        }
        case "X": {
            io.in("test game").emit("game over", rooms.find((room) => room.code === roomID).player1)

            break;
        }
        default:
            break;
    }
}

function createRoom(socket, data) {
    rooms.push({
        code: data.code,
        playerCount: 1,
        player1: true,
        tiles: [],
        players: [data.player],
    })
    socket.join(data.code)
    console.log("room created")
}

function joinRoom(socket, data) {
    if (typeof rooms.find((room) => room.code === data.code) != "undefined") {
        socket.join(data.code)
        rooms.find((room) => room.code === data.code).players.push(data.player)
        io.in(data.code).emit("player joined", "2 spelers in lobby")
        console.log("player connected to " + data.code)
        console.log("players: " + rooms.find((room) => room.code === data.code).players)
    }
}


io.listen(3001)

