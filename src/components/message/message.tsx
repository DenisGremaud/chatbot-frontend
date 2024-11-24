// src/components/message/Message.tsx

import './message.css';
import { forwardRef } from 'react';
import Markdown from './markdown';

export enum MessageType {
	User = 'user',
	Bot = 'bot',
}

export enum MessageStatus {
	Ongoing = 'ongoing',
	Finished = 'finished',
}  

export interface MessageProps {
  content: string;
  type: MessageType;
  status?: MessageStatus;
}

const Message = forwardRef<HTMLLIElement, MessageProps>(({ content, type }, ref) => (
	<li ref={ref} className={`message ${type === MessageType.User ? 'user-message' : 'bot-message'}`}>
		<Markdown content={content}></Markdown>
	</li>
));
  
export default Message;
