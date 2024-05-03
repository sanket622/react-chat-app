import React, { useState } from 'react';
import './ChatInput.css';
import io from 'socket.io-client';

const ChatInput = ({ onSend }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() !== '') {
      // Establish a Socket.IO connection
      const socket = io();

      // Send the message to the server
      socket.emit('message', message);

      // Invoke the onSend callback provided by the parent component
      onSend(message);

      // Clear the message input
      setMessage('');
    }
  };

  return (
    <div className="chat-input">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default ChatInput;
