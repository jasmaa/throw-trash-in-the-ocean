// server.js
// Main express app

const express = require('express');
const morgan = require('morgan');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const { World } = require('./src/game');
const { getRandomValue } = require('./src/utils');
const pool = require('./src/config/dbConfig');

// Middlware
app.use(morgan('tiny'))
app.use(express.static(__dirname + '/node_modules'));

// Routes

// TEMP: server testing
app.get('/game/:roomName', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// === Game ===
let activeRooms = new Set();
let worlds = {};

// Periodically update and save rooms
setInterval(async () => {
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
            await world.save(pool);
            io.in(roomName).emit('sync', world.getStat());
        } else {
            newWorld = new World(roomName);
            await newWorld.readOrCreate(pool);
            worlds[roomName] = newWorld;
        }
    }
}, 1000);

io.on('connection', client => {

    client.on('join', async data => {

        const roomName = data['room_name'];
        let userID = data['user_id'];
        let world = worlds[roomName];

        client.join(roomName);

        // Add room
        activeRooms.add(roomName);
        if (!world) {
            world = new World(roomName);
            await world.readOrCreate(pool);
            worlds[roomName] = world;
        }

        // Add user
        let res = await pool.query(`SELECT * FROM users WHERE user_id=$1`, [userID]);
        if (res.rowCount <= 0) {
            userID = getRandomValue(30);
            const userHandle = `awesome-user-${getRandomValue(5)}`; //TODO: generate new user handle here

            await pool.query(
                `INSERT INTO users (user_id, user_handle) VALUES ($1, $2)`,
                [userID, userHandle],
            );
        }

        // Add player
        res = await pool.query(
            `SELECT * FROM players WHERE user_id=$1 AND room_id=$2`,
            [userID, world.roomID],
        );

        let currProfit = 0;
        if (res.rowCount <= 0) {
            await pool.query(
                `INSERT INTO players (user_id, room_id, profit) VALUES ($1, $2, $3)`,
                [userID, worlds[roomName].roomID, 0],
            )
        } else {
            currProfit = res.rows[0]['profit'];
        } 

        // Update client
        client.emit('join', {
            user_id: userID,
        });
        client.emit('sync', world.getStat());
        client.emit('pollute', { profit: currProfit });
    });


    client.on('pollute', async data => {

        const roomName = data['room_name'];
        const userID = data['user_id'];
        const world = worlds[roomName];

        // Update world
        world.pollute(1);
        await world.save(pool);

        // Update player
        let res = await pool.query(
            `SELECT * FROM players WHERE user_id=$1 AND room_id=$2`,
            [userID, world.roomID],
        );

        const currProfit = res.rows[0]['profit'] + 1;
        await pool.query(
            `UPDATE players SET profit=$3 WHERE user_id=$1 AND room_id=$2`,
            [userID, world.roomID, currProfit],
        );

        // Update client
        client.emit('pollute', { profit: currProfit });
        io.in(roomName).emit('sync', world.getStat());
    });
});

server.listen(3001, () => console.log("Starting server on 3001..."));
