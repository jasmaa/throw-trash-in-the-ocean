// server.js
// Main express app

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const { World } = require('./src/game');
const { getRandomValue } = require('./src/utils');
const pool = require('./src/config/dbConfig');

// === Middlware ===
app.use(morgan('tiny'));
app.use(express.static(__dirname + '/node_modules'));
app.use(cors());

// === Game ===
const THROTTLE_TIME = 100;
const activeRooms = new Set();
const worlds = {};

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

// Socket handlers
io.on('connection', client => {

    client.on('join', async data => {

        // TODO: validate room name here

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
        let userHandle;

        if (res.rowCount <= 0) {
            userID = getRandomValue(30);
            userHandle = `awesome-user-${getRandomValue(5)}`; //TODO: generate new user handle here

            await pool.query(
                `INSERT INTO users (user_id, user_handle) VALUES ($1, $2)`,
                [userID, userHandle],
            );
        } else {
            userHandle = res.rows[0]['user_handle']
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

        // Update cache
        world.players[userID] = {
            userHandle: userHandle,
            profit: currProfit,
        };

        // Update client
        client.emit('join', {
            user_id: userID,
            user_handle: userHandle,
        });
        client.emit('sync', world.getStat());
        client.emit('set_handle', { user_handle: userHandle });
        client.emit('pollute', { profit: currProfit });
    });


    client.on('pollute', async data => {

        const roomName = data['room_name'];
        const userID = data['user_id'];
        const world = worlds[roomName];

        // Update player
        let res = await pool.query(
            `SELECT * FROM players WHERE user_id=$1 AND room_id=$2`,
            [userID, world.roomID],
        );

        if (res.rowCount > 0) {
            // Check throttle
            const now = new Date();
            const timeBetween = now - world.players[userID].lastActionTime;
            if (timeBetween < THROTTLE_TIME) {
                return;
            } else {
                world.players[userID].lastActionTime = now;
            }

            // Update world
            world.pollute(1);
            await world.save(pool);

            const currProfit = res.rows[0]['profit'] + 1;
            await pool.query(
                `UPDATE players SET profit=$3 WHERE user_id=$1 AND room_id=$2`,
                [userID, world.roomID, currProfit],
            );

            // Update cache
            world.players[userID].profit = currProfit;

            // Update client
            client.emit('pollute', { profit: currProfit });
            io.in(roomName).emit('sync', world.getStat());
        }
    });

    client.on('set_handle', async data => {

        const world = worlds[roomName];
        let userID = data['user_id'];
        let userHandle = data['user_handle'];

        if (userHandle.length <= 30) {

            // Update user
            await pool.query(
                `UPDATE users SET user_handle=$2 WHERE user_id=$1`,
                [userID, userHandle],
            );

            // Update cache
            world.players[userID].userHandle = userHandle;
            client.emit('set_handle', { user_handle: userHandle });
            io.in(roomName).emit('sync', world.getStat());
        }
    });
});

server.listen(3001, () => console.log("Starting server on 3001..."));
