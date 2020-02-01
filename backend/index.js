
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
    res.sendFile(__dirname + '/index.html');
});

// Game
const world = new World();

// Update world
setInterval(() => {
    world.recover(1);

    // Resync clients
    io.in('master').clients((err, clients) => {
        for (clientID of clients) {
            const c = io.sockets.connected[clientID];
            c.emit('sync', world.getStat());
        }
    });
}, 1000);

io.on('connection', client => {

    client.on('join', data => {
        client.join('master'); // join master room for now
    });

    client.on('pollute', data => {
        world.pollute(1);
        client.emit('sync', world.getStat());
        client.broadcast.emit('sync', world.getStat());
    });
});

server.listen(3000, () => console.log("Starting server on 3000..."));
