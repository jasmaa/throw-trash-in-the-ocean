// server.js
// Main express app
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const { World, User, Player, Event } = require('./src/game');
const { level2profit, level2cost } = require('./src/utils');

// === Middlware ===
app.use(morgan('tiny'));
app.use(express.static(__dirname + '/node_modules'));
app.use(cors());

// === Game ===
const THROTTLE_TIME = 100;
const UPDATE_TIME = 1000;

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
            world.update(UPDATE_TIME);
            await world.save();
            io.in(roomName).emit('sync', world.getState());
        } else {
            newWorld = new World(roomName);
            await newWorld.readOrCreate();
            worlds[roomName] = newWorld;
        }
    }
}, UPDATE_TIME);

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

        if (!world.isDead) {
            // Log join
            const joinEvent = await Event.createEvent(world.roomID, player.userID, 'join');

            // Update cache
            world.players[player.userID] = player;
            world.events.unshift(joinEvent);

            // Update client
            client.emit('join', {
                user_id: player.userID,
                user_handle: player.userHandle,
            });
            client.emit('set_handle', {
                'user_handle': player.userHandle,
            });
        }

        client.emit('sync', world.getState());

    });

    client.on('pollute', async data => {

        const userID = data['user_id'];
        const roomName = data['room_name'];
        const world = worlds[roomName];

        // Abort if world does not exist or is dead
        if (!world || world.isDead) {
            return;
        }

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

        if (world.getHealth() <= 0) {

            // Destroy world if over-polluted
            world.kill();
            await world.save();


        } else {

            await world.save();

            // Save user profit
            const currProfit = player.profit + level2profit(player.powerClickLevel);
            await Player.updateProfit(userID, world.roomID, currProfit);
            world.players[userID].profit = currProfit;
        }

        // Update client
        io.in(roomName).emit('pollute');
        io.in(roomName).emit('sync', world.getState());
    });

    client.on('set_handle', async data => {

        const userID = data['user_id'];
        const userHandle = data['user_handle'];
        const roomName = data['room_name'];
        const world = worlds[roomName];

        // Abort if world does not exist or is dead
        if (!world || world.isDead) {
            return;
        }

        if (userHandle.length <= 30) {
            // Update user
            await User.updateHandle(userID, userHandle);
            world.players[userID].userHandle = userHandle;

            // Update client
            client.emit('set_handle', {
                'user_handle': userHandle,
            });
            io.in(roomName).emit('sync', world.getState());
        }
    });

    client.on('upgrade_click', async data => {

        const userID = data['user_id'];
        const roomName = data['room_name'];
        const world = worlds[roomName];

        // Abort if world does not exist or is dead
        if (!world || world.isDead) {
            return;
        }

        const userInfo = await User.createOrGet(userID);
        const player = await Player.createOrGet(userInfo, world.roomID);

        if (player.profit >= level2cost(player.powerClickLevel)) {

            const currProfit = player.profit - level2cost(player.powerClickLevel);
            await Player.updateProfit(userID, world.roomID, currProfit);
            world.players[userID].profit = currProfit;

            const currClickLevel = player.powerClickLevel + 1;
            await Player.updateClickLevel(userID, world.roomID, currClickLevel);
            world.players[userID].powerClickLevel = currClickLevel;

            // Update client
            io.in(roomName).emit('sync', world.getState());
        }
    });
});

server.listen(3001, () => console.log("Starting server on 3001..."));
