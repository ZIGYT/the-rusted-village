const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { handleGameLogic } = require('./gameLogic');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

let rooms = {};

io.on('connection', (socket) => {
  socket.on('createRoom', ({ username }, callback) => {
    const roomId = Math.random().toString(36).substr(2, 6);
    rooms[roomId] = { players: [{ id: socket.id, username }], gameState: null };
    socket.join(roomId);
    callback(roomId);
    io.to(roomId).emit('roomUpdate', rooms[roomId]);
  });

  socket.on('joinRoom', ({ roomId, username }, callback) => {
    if (!rooms[roomId]) return callback({ error: "Room not found" });
    rooms[roomId].players.push({ id: socket.id, username });
    socket.join(roomId);
    callback({ success: true });
    io.to(roomId).emit('roomUpdate', rooms[roomId]);
  });

  socket.on('startGame', ({ roomId }) => {
    if (!rooms[roomId]) return;
    rooms[roomId].gameState = handleGameLogic.initializeGame(rooms[roomId].players);
    io.to(roomId).emit('gameStarted', rooms[roomId].gameState);
  });

  socket.on('sendChat', ({ roomId, username, message }) => {
    io.to(roomId).emit('receiveChat', { username, message });
  });

  // Add more game event handlers here (night actions, voting, etc.)

  socket.on('disconnect', () => {
    Object.keys(rooms).forEach(roomId => {
      rooms[roomId].players = rooms[roomId].players.filter(p => p.id !== socket.id);
      io.to(roomId).emit('roomUpdate', rooms[roomId]);
    });
  });
});

server.listen(4000, () => {
  console.log('Server running on port 4000');
});