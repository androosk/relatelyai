export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}
