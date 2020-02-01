
const express = require('express');
const morgan = require('morgan');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const { World } = require('./game');

// Middlware
app.use(morgan('tiny'))
app.use(express.static(__dirname + '/node_modules'));

// Routes
app.get('/', (req, res) => {
    res.send("i am the main page");
});

app.get('/game/:roomName', (req, res) => {
    // TODO: send room name to frontend here
    // const roomName = req.params.roomName;
    res.sendFile(__dirname + '/index.html');
});

// Game
let activeRooms = new Set();
let worlds = {};

// Update rooms
setInterval(() => {
    for (roomID of activeRooms) {

        const room = io.sockets.adapter.rooms[roomID];

        // Skip undefined
        if(room == undefined){
            continue;
        }

        if(room <= 0){
            // Remove inactive room
            activeRooms.delete(roomID);

        } else {

            const world = worlds[roomID];

            if (world) {
                world.recover(1);
                io.in(roomID).emit('sync', world.getStat());
            } else {
                worlds[roomID] = new World();
                // TODO: reinit here from db
            }
        }
    }
}, 1000);

io.on('connection', client => {

    client.on('join', data => {

        const roomID = data['room_id'];
        activeRooms.add(roomID);
        client.join(roomID);
    });

    client.on('pollute', data => {
        
        const roomID = data['room_id'];
        const world = worlds[roomID];

        world.pollute(1);
        io.in(roomID).emit('sync', world.getStat());
    });
});

server.listen(3000, () => console.log("Starting server on 3000..."));
