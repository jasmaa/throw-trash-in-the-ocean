
const express = require('express');
const morgan = require('morgan');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Middlware
app.use(morgan('tiny'))
app.use(express.static(__dirname + '/node_modules'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// WebSocket
io.on('connection', client => {
    console.log('client connected');

    client.on('join', data => {
        console.log(data);
    });

    client.on('messages', data => {
        console.log('message: ' + data);
        client.emit('broad', data);
        client.broadcast.emit('broad', data);
    })
});

server.listen(3000, () => console.log("Starting server on 3000..."));
