import { createContext, useContext, ReactNode } from 'react';
import { Message, ChatSession } from '../../types/chat';
import { useChat as useInternalChat } from '../../hooks/useChat';

interface ChatContextType {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
  startNewChat: () => Promise<ChatSession | null>;
  sendUserMessage: (content: string) => Promise<void>;
  switchSession: (sessionId: string) => ChatSession | null;
  switchToSession: (sessionId: string) => boolean;
  deleteSession: (sessionId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const chatHook = useInternalChat();

  return <ChatContext.Provider value={chatHook}>{children}</ChatContext.Provider>;
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
