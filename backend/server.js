// server.js
// Main express app

const express = require('express');
const morgan = require('morgan');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const { World, Player } = require('./game');
const pool = require('./config/dbConfig');

// Middlware
app.use(morgan('tiny'))
app.use(express.static(__dirname + '/node_modules'));

// Routes
app.get('/dataTest', (req, res) => {
    res.json({
        hi: 'hi',
    });
});

app.get('/game/:roomName', (req, res) => {
    // TODO: send room name to frontend here
    // const roomName = req.params.roomName;
    res.sendFile(__dirname + '/index.html');
});

// Game
let activeRooms = new Set();
let worlds = {};
let players = {}; // TODO: Replace with db connection??

// Periodically update and save rooms
setInterval(() => {
    for (roomName of activeRooms) {
        const room = io.sockets.adapter.rooms[roomName];
        const world = worlds[roomName];

        if (room == undefined) continue;

        // Remove inactive room
        if (room.length <= 0) {
            activeRooms.delete(roomName);
        }

        // Update or init room
        if (world) {
            world.update();
            world.save(pool);
            
            io.in(roomName).emit('sync', world.getStat());
        } else {
            newWorld = new World(roomName);
            newWorld.readOrCreate(pool);
            worlds[roomName] = newWorld;
        }
    }
}, 1000);

io.on('connection', client => {

    client.on('join', data => {

        const roomName = data['room_name'];
        const playerID = data['player_id'];

        activeRooms.add(roomName);
        client.join(roomName);

        // Add user
        // TODO: Replace with db retrieval
        players[playerID] = new Player(client, playerID);
    });

    client.on('pollute', data => {

        const roomName = data['room_name'];
        const playerID = data['player_id'];

        const world = worlds[roomName];

        world.pollute(1);
        players[playerID].gainProfit(1);
        io.in(roomName).emit('sync', world.getStat());
    });
});

server.listen(3001, () => console.log("Starting server on 3001..."));
