import React, { useState, useEffect } from 'react';
import ChatMessage from './chatMessage';
import ChatInput from './chatInput';
import io from 'socket.io-client';
import './App.css';

const user_list = ["Alan", "Bob", "Carol", "Dean", "Elin"];

function App() {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Establish a Socket.IO connection
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    // Log connection status
    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    // Log disconnection status
    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    // Log connection errors
    newSocket.on('error', (error) => {
      console.error('Connection error:', error);
    });

    // Subscribe to the chat channel
    newSocket.emit('subscribeToChat');

    // Listen for incoming messages
    newSocket.on('message', (data) => {
      setMessages(prevMessages => [...prevMessages, data]);
    });

    return () => {
      newSocket.disconnect(); // Clean up the socket connection on component unmount
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
    // Publish message to the chat channel
    socket.emit('publishToChat', newMessage);
  };

  return (
    <div className="App">
      <div className="chat-container">
        {messages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>
      <ChatInput onSend={handleMessageSend} />
    </div>
  );
}

export default App;
