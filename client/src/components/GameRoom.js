import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Chat from './Chat';
const socket = io('http://localhost:4000');

function GameRoom({ roomId }) {
  const [room, setRoom] = useState(null);
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    socket.on('roomUpdate', setRoom);
    socket.on('gameStarted', setGameState);
    socket.emit('joinRoom', { roomId, username: 'Player' }, () => {});
    return () => {
      socket.off('roomUpdate');
      socket.off('gameStarted');
    };
  }, [roomId]);

  const startGame = () => {
    socket.emit('startGame', { roomId });
  };

  return (
    <div>
      <h3>Lobby: {roomId}</h3>
      {room && (
        <div>
          <div>Players: {room.players.map(p => p.username).join(', ')}</div>
          {!gameState && <button onClick={startGame}>Start Game</button>}
        </div>
      )}
      {gameState && (
        <div>
          <div>Game Phase: {gameState.phase}</div>
          <div>
            {gameState.players.map((p, i) => (
              <div key={i}>{p.username} - {p.role} {p.alive ? '' : '(dead)'}</div>
            ))}
          </div>
          <Chat roomId={roomId} />
        </div>
      )}
    </div>
  );
}

export default GameRoom;