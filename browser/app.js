var socket = io(window.location.origin);

socket.on('connect', function () {
    console.log('I have made a persistent two-way connection to the server!');
});

whiteboard.on('draw', function (...payload) {
    socket.emit('drawing', ...payload)
});

socket.on('someoneDrew', function (...payload) {
    whiteboard.draw(...payload)
})



