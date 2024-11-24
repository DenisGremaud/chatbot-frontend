// src/components/chatview/ChatManager.ts
import io, { 
	Socket 
} from 'socket.io-client';
import { 
	MessageProps, 
	MessageType, 
	MessageStatus 
} from '../message/message';
import Config from '../../config/config';

class ChatManager {
  private static instance: ChatManager;
  private socket: Socket | null = null;
  private sessionId: string | null = localStorage.getItem('sessionId');
  private messages: MessageProps[] = [];
  private userUUID: string | null = localStorage.getItem('userUUID');
  private newMessageCallback: ((messages: MessageProps[]) => void) | null = null;
  private newSessionCallback: ((sessionId: string) => void) | null = null;

  private constructor() {
    this.initSocket();
  }

  public static getInstance(): ChatManager {
    if (!ChatManager.instance) {
      ChatManager.instance = new ChatManager();
    }
    return ChatManager.instance;
  }

  public getActiveSessionId(): string | null {
	return this.sessionId;
  }

  public setNewMessageCallback(callback: (messages: MessageProps[]) => void) {
    this.newMessageCallback = callback;
  }

  public setNewSessionCallback(callback: (sessionId: string) => void) {
	this.newSessionCallback = callback;
  }

  private initSocket() {
    this.socket = io(Config.SOCKET_URL);

    this.socket.on('connect', () => {
	  if (!this.userUUID) {
        this.createUserUUID();
	  } else if (this.sessionId) {
        this.socket!.emit('restore_session', { session_id: this.sessionId });
      } else {
        this.socket!.emit('init', { user_uuid: this.userUUID });
      }
    });

    this.socket.on('session_init', (data) => {
      this.sessionId = data.session_id;
      this.messages.push({ type: MessageType.Bot, content: data.initial_message });
      this.updateMessages();
	  if (this.newSessionCallback) {
		this.newSessionCallback(data.session_id);
	  }
    });

    this.socket.on('session_restored', (data) => {
      localStorage.setItem('sessionId', data.session_id);
      this.sessionId = data.session_id;
      this.messages = data.chat_history;
      this.updateMessages();
    });

    this.socket.on('response_start', () => {
      this.messages.push({ type: MessageType.Bot, content: '', status: MessageStatus.Ongoing });
      this.updateMessages();
    });

    this.socket.on('response', (message) => {
      this.messages = this.messages.map((msg) =>
        msg.status === MessageStatus.Ongoing ? { ...msg, content: msg.content + message } : msg
      );
      this.updateMessages();
    });

    this.socket.on('response_end', () => {
      console.log('Response ended');
      this.messages = this.messages.map((msg) =>
        msg.status === MessageStatus.Ongoing ? { ...msg, status: MessageStatus.Finished } : msg
      );
      this.updateMessages();
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

	this.socket.on('error', (error) => {
		console.error(error);
	});
  }

  public sendMessage(content: string) {
    if (this.sessionId) {
      this.socket?.emit('query', { question: content, session_id: this.sessionId });
      this.messages.push({ type: MessageType.User, content });
      this.updateMessages();
    } else {
      console.error('Session ID is not set.');
    }
  }

  public createNewSession() {
    localStorage.removeItem('sessionId');
    this.sessionId = null;
    this.messages = [];
    this.socket?.emit('init', { user_uuid: this.userUUID });
  }

  public async createUserUUID() {
	localStorage.removeItem('userUUID');
	try {
		const response = await fetch(`${Config.API_URL}/create_user`, {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json'
			},
		});
		const data = await response.json();
		localStorage.setItem('userUUID', data.user_uuid);
		this.userUUID = data.user_uuid;
	} catch (error) {
		console.error('Error creating user UUID:', error);
	}
  }

  public getUserUUID(): string | null {
	return this.userUUID;
  }

  public async testIfUserUUIDExists() {
	if (!this.userUUID) {
	  return false;
	} else if (this.userUUID) {
	  try {
		const response = await fetch(`${Config.API_URL}/check_user_exists/${this.userUUID}`);
		const data = await response.json();
		console.log('User exists:', data.user_exists);
		return data.user_exists;
	  } catch (error) {
		console.error('Error checking if user exists:', error);
	  }
	}
  }

  private updateMessages() {
    if (this.newMessageCallback) {
      this.newMessageCallback(this.messages);
    }
  }

  public async getUserSessions(): Promise<string[]> {
    if (this.userUUID) {
      try {
        const response = await fetch(`${Config.API_URL}/get_user_sessions/${this.userUUID}`);
        if (!response.ok) {
          throw new Error(`Error fetching sessions: ${response.statusText}`);
        }
        const { session_ids } = await response.json();
        return session_ids || [];
      } catch (error) {
        console.error('Failed to fetch user sessions:', error);
        return [];
      }
    } else {
      console.error('User UUID not found');
      return [];
    }
  }

  public restoreSession(sessionId: string) {
	this.socket?.emit('restore_session', { session_id: sessionId });
  }

  public getStoredSessionId(): string | null {
	return this.sessionId;
  }

  public disconnect() {
    this.socket?.disconnect();
  }

}

export default ChatManager;
