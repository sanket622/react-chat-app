import React, { useState, useEffect } from 'react';
import ChatMessage from './chatMessage';
import ChatInput from './chatInput';
import io from 'socket.io-client';
import './App.css';

const user_list = ["Alan", "Bob", "Carol", "Dean", "Elin"];

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Establish a Socket.IO connection
    const socket = io('http://localhost:3001');


    // Log connection status
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    // Log disconnection status
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    // Log connection errors
    socket.on('error', (error) => {
      console.error('Connection error:', error);
    });

    return () => {
      socket.disconnect(); // Clean up the socket connection on component unmount
    };
  }, []); // Empty dependency array ensures this effect runs only once, similar to componentDidMount

  const handleMessageSend = (messageContent) => {
    const randomIndex = Math.floor(Math.random() * user_list.length);
    const randomUser = user_list[randomIndex];
    const newMessage = {
      id: Math.random().toString(36).substr(2, 9),
      user: randomUser,
      content: messageContent,
      likes: 0,
    };
    setMessages([...messages, newMessage]);
  };

  const handleLike = (id) => {
    const updatedMessages = messages.map(message => {
      if (message.id === id) {
        return { ...message, likes: message.likes + 1 };
      }
      return message;
    });
    setMessages(updatedMessages);
  };

  return (
    <div className="App">
      <div className="chat-container">
        {messages.map(message => (
          <ChatMessage key={message.id} message={message} onLike={handleLike} />
        ))}
      </div>
      <ChatInput onSend={handleMessageSend} />
    </div>
  );
}

export default App;
