// server.js
// Main express app

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const { World } = require('./src/game');
const { User, Player } = require('./src/game/store');

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
            await world.save();
            io.in(roomName).emit('sync', world.getStat());
        } else {
            newWorld = new World(roomName);
            await newWorld.readOrCreate();
            worlds[roomName] = newWorld;
        }
    }
}, 1000);

const click2profit = (level) => 5 * level + 1;

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
            await world.readOrCreate();
            worlds[roomName] = world;
        }

        const userInfo = await User.createOrGet(userID);
        const player = await Player.createOrGet(userInfo, world.roomID);

        // Update cache
        world.players[player.userID] = player;

        // Update client
        client.emit('join', {
            user_id: player.userID,
            user_handle: player.userHandle,
        });
        client.emit('sync', world.getStat());
        client.emit('set_handle', { user_handle: player.userHandle });
        client.emit('pollute', { profit: player.profit });
    });


    client.on('pollute', async data => {

        const userID = data['user_id'];
        const roomName = data['room_name'];
        const world = worlds[roomName];

        const userInfo = await User.createOrGet(userID);
        const player = await Player.createOrGet(userInfo, world.roomID);

        // Check throttle
        const now = new Date();
        const timeBetween = now - world.players[player.userID].lastActionTime;
        if (timeBetween < THROTTLE_TIME) {
            return;
        } else {
            world.players[player.userID].lastActionTime = now;
        }

        // Update world
        world.pollute(1);
        await world.save();

        // Save user profit
        const currProfit = player.profit + click2profit(player.powerClickLevel);
        Player.updateProfit(userID, world.roomID, currProfit);
        world.players[userID].profit = currProfit;

        // Update client
        client.emit('pollute', { profit: currProfit });
        io.in(roomName).emit('sync', world.getStat());

    });

    client.on('set_handle', async data => {

        let userID = data['user_id'];
        let userHandle = data['user_handle'];
        const roomName = data['room_name'];
        const world = worlds[roomName];

        if (userHandle.length <= 30) {

            // Update user
            User.updateHandle(userID, userHandle);

            // Update cache
            world.players[userID].userHandle = userHandle;
            client.emit('set_handle', { user_handle: userHandle });
            io.in(roomName).emit('sync', world.getStat());
        }
    });
});

server.listen(3001, () => console.log("Starting server on 3001..."));
