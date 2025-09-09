import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
const socket = io('http://localhost:4000');

function Chat({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    socket.on('receiveChat', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('receiveChat');
    };
  }, []);

  const sendChat = () => {
    socket.emit('sendChat', { roomId, username: 'Player', message: input });
    setInput('');
  };

  return (
    <div>
      <div>
        {messages.map((m, i) => (
          <div key={i}><b>{m.username}:</b> {m.message}</div>
        ))}
      </div>
      <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message" />
      <button onClick={sendChat} disabled={!input}>Send</button>
    </div>
  );
}

export default Chat;