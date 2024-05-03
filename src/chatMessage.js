import React, { useEffect, useState } from 'react';
import './ChatMessage.css';
import io from 'socket.io-client';

const ChatMessage = ({ message, onLike }) => {
  const { user, content, id } = message;
  const [likeCount, setLikeCount] = useState(message.likes);

  useEffect(() => {
    const socket = io();

    // Listen for updates to the like count for this message
    socket.on(`likeCountUpdate_${id}`, (newLikeCount) => {
      setLikeCount(newLikeCount);
    });

    return () => {
      socket.disconnect(); // Clean up the socket connection on component unmount
    };
  }, [id]);

  const handleLikeClick = () => {
    const socket = io();
    socket.emit('like', id); // Send a like event to the server
  };

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
