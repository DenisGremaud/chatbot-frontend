// src/components/chatview/ChatView.tsx
import React, { useCallback, useRef, useEffect, FormEvent, KeyboardEvent, useState } from 'react';
import { Box, IconButton, TextareaAutosize } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SendIcon from '@mui/icons-material/Send';
import Message, { MessageProps, MessageType, MessageStatus } from '../message/message';
import ChatManager from './chatmanager';
import './chatview.css';

interface ChatViewProps {
  messages: MessageProps[];
  isSidebarOpen: boolean;
}

const ChatView: React.FC<ChatViewProps> = ({ messages, isSidebarOpen }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isLastMessageInView, setIsLastMessageInView] = useState(false);
  const [isReciving, setIsReciving] = useState(false);

  const lastMessageRef = useRef<HTMLLIElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    setIsReciving(messages.some((msg) => msg.status === MessageStatus.Ongoing));
  }, [messages]);

  const handleSendMessage = useCallback((e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    ChatManager.getInstance().sendMessage(newMessage);
    setNewMessage('');
  }, [newMessage]);

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage(event as unknown as FormEvent);
    } else if (event.key === 'Enter' && event.ctrlKey) {
      setNewMessage(prevMessage => prevMessage + '\n');
	}
  }, [handleSendMessage]);

  const scrollToLastMessage = useCallback(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, []);

  useEffect(() => {
    scrollToLastMessage();
  }, [messages, scrollToLastMessage]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      const entry = entries[0];
      setIsLastMessageInView(entry.isIntersecting);
    });

    const currentLastMessageRef = lastMessageRef.current;

    if (currentLastMessageRef) {
      observerRef.current.observe(currentLastMessageRef);
    }

    return () => {
      if (observerRef.current && currentLastMessageRef) {
        observerRef.current.unobserve(currentLastMessageRef);
      }
    };
  }, [messages]);

  useEffect(() => {
	const handleResize = () => {
	  window.scrollTo(0, 0);
	  document.body.scrollTop = 0;
	};
	window.addEventListener('resize', handleResize);
	return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Box className="chat-container">
      <Box className="chat-message-list">
        <ul className="messages-list">
          {messages.map((message, index) => (
            <Message
              key={index}
              type={message.type}
              content={message.content}
              ref={index === messages.length - 1 ? lastMessageRef : null}
            />
          ))}
        </ul>
      </Box>
      {!isLastMessageInView && (
        <Box className="scroll-button-container">
          <IconButton onClick={scrollToLastMessage} className="scroll-button">
            <ArrowDownwardIcon sx={{ color: 'white' }} />
          </IconButton>
        </Box>
      )}
      <Box component="form" onSubmit={handleSendMessage} className={`message-form ${isSidebarOpen ? 'hide' : ''}`}>
        <TextareaAutosize
          value={newMessage}
          onKeyDown={handleKeyDown}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message here..."
          className="message-input"
          minRows={1}
          maxRows={3}
        />
        <IconButton
          type="submit"
          className={`send-button ${isReciving ? 'receiving' : ''}`}
          disabled={isReciving}
        >
          <SendIcon className="send-icon" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatView;
