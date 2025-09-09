import React, { useState } from 'react';
import io from 'socket.io-client';
const socket = io('http://localhost:4000');

function Lobby({ setRoomId }) {
  const [username, setUsername] = useState('');
  const [joinId, setJoinId] = useState('');

  const createRoom = () => {
    socket.emit('createRoom', { username }, (roomId) => {
      setRoomId(roomId);
    });
  };

  const joinRoom = () => {
    socket.emit('joinRoom', { roomId: joinId, username }, (res) => {
      if (res.success) setRoomId(joinId);
      else alert(res.error);
    });
  };

  return (
    <div>
      <h2>The Rusted Village</h2>
      <input placeholder="Your Name" value={username} onChange={e => setUsername(e.target.value)} />
      <button onClick={createRoom} disabled={!username}>Create Lobby</button>
      <br />
      <input placeholder="Lobby Code" value={joinId} onChange={e => setJoinId(e.target.value)} />
      <button onClick={joinRoom} disabled={!username || !joinId}>Join Lobby</button>
    </div>
  );
}

export default Lobby;
