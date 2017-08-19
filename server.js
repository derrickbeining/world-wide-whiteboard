var path = require('path');
var express = require('express');
var app = express();
var socketio = require('socket.io');
var server = app.listen(1337, function () {
    console.log('The server is listening on port 1337!');
});
var io = socketio(server);

app.use(express.static(path.join(__dirname, 'browser')));
// app.use(express.static(path.join(__dirname, 'socket.io')));

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const drawingHistory = {};

io.on('connection', function (socket) {
    console.log('A new client has connected!', socket.id);

    let room = null
    socket.on('requestToJoinRoom', function (roomName) {
        room = roomName
        socket.join(roomName)
        if (!drawingHistory[ roomName ]) {
            drawingHistory[ roomName ] = []
        }
        socket.emit('drawingHistory', drawingHistory[ roomName ])
    })

    socket.on('drawing', function (start, end, color) {
        drawingHistory[ room ].push({ start: start, end: end, color: color })
        socket.broadcast.to(room).emit('someoneElseDrawing', start, end, color)
    })
    socket.on('disconnect', function () {
        console.log('socket ' + socket.id + ' disconnected')
    })
});
