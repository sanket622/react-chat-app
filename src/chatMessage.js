import React, { useEffect, useState } from 'react';
import './ChatMessage.css';
import io from 'socket.io-client';

const ChatMessage = ({ message, onLike }) => {
  const { user, content, id } = message;
  const [likeCount, setLikeCount] = useState(message.likes);
  const socket = io(); // Establish a Socket.IO connection

  const handleLikeClick = () => {
    // Increment like count locally
    setLikeCount(prevCount => prevCount + 1);
  
    // Emit a 'like' event to the server with the message ID
    socket.emit('like', id);
  };
  

  useEffect(() => {
    // Listen for updates to the like count for this message
    socket.on('likeCountUpdate', (updatedMessage) => {
      if (updatedMessage.id === id) {
        // Update the like count locally
        setLikeCount(updatedMessage.likes);
      }
    });

    return () => {
      socket.off('likeCountUpdate'); // Remove the listener on component unmount
    };
  }, [id, socket]);

  return (
    <div className="chat-message">
      <span className="username">{user}:</span>
      <br /><br />
      <span className="content">{content}</span>
      <button className="like-btn" onClick={handleLikeClick}>
        Like <span className="like-count">{likeCount}</span>
      </button>
    </div>
  );
};

export default ChatMessage;
