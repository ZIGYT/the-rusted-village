import React, { useState } from 'react';
import Lobby from './components/Lobby';
import GameRoom from './components/GameRoom';
import './App.css';

function App() {
  const [roomId, setRoomId] = useState(null);

  return (
    <div className="App">
      {!roomId ? (
        <Lobby setRoomId={setRoomId} />
      ) : (
        <GameRoom roomId={roomId} />
      )}
    </div>
  );
}

export default App;