/* global whiteboard io */

var socket = io(window.location.origin);

socket.on('connect', function () {
    console.log('Persistent connection established with server');
    const roomName = location.pathname

    socket.emit('requestToJoinRoom', roomName)

});

whiteboard.on('draw', function (start, end, color) {
    socket.emit('drawing', start, end, color)
});

socket.on('someoneElseDrawing', function (start, end, color) {
    whiteboard.draw(start, end, color)
})

socket.on('drawingHistory', function (drawingHistory) {
    drawingHistory.forEach(function (data) {
        whiteboard.draw(data.start, data.end, data.color)
    })
})

