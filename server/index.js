const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join', ({ name, room }, callback) => {
    console.log(name, room);
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room, ${user.room}!` });
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined!`});

    socket.join(user.room);

    callback();
  });

  socket.on('disconnect', () => {
    console.log('user disconnected. . . ');
  });
});

app.use(router);

server.listen(PORT, () => console.log(`Server has launched on port ${PORT}😎😎😎`));
