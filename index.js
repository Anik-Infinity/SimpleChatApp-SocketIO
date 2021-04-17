const print = console.log
const path = require('path')
const port = process.env.PORT || 8080
const publicDirectoryPath = path.join(__dirname, '../public')
const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const io = require('socket.io').listen(server)

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Chat Server is running on port 3000')
});

let c = 1

io.on('connection', (socket) => {

    io.emit('userCount', 'total user: ' + c)

    socket.on('deviceName', (message) => {
        print(message)
    })

    socket.on('join', function(userNickname) {
        c = c + 1
        io.emit('userCount', 'total user: ' + c)
        socket.broadcast.emit('userStatus', userNickname + " has joined the chat");
    })

    socket.on('chat', function(data) {
        io.emit('chat', data);
    });

    socket.on('disconnect', function(userNickname) {
        c = c - 1
        if (c <= 0) c = 1
        io.emit('userCount', 'total user: ' + c)
        socket.broadcast.emit('userStatus', userNickname + "has left the chat");
    })
})

server.listen(port, () => {
    console.log('Node app is running on port 8080')
})