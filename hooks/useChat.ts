import { useState, useEffect, useCallback } from 'react';
import { Message, ChatSession } from '../types/chat';
import {
  createNewChatSession,
  getChatSessions,
  sendMessage,
  deleteChatSession,
} from '../components/services/chatService';
import { useAuth } from 'components/contexts/AuthContext';

export const useChat = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const WELCOME_MESSAGE: Message = {
    id: 'welcome',
    role: 'assistant',
    content: `Hello, I'm Dr. Relate, your relationship advisor. I'm here to help you navigate your relationship questions and challenges.

You can ask me about:
• Communication strategies
• Managing conflicts
• Setting healthy boundaries
• Building trust and intimacy
• Recognizing relationship patterns

Feel free to share what's on your mind, and we can explore it together. What relationship topic would you like guidance on today?`,
    createdAt: new Date(),
  };

  useEffect(() => {
    if (!user) return;

    const fetchSessions = async () => {
      try {
        setLoading(true);
        const userSessions = await getChatSessions(user.id);
        setSessions(userSessions);

        if (userSessions.length > 0 && !currentSession) {
          console.log('useChat: No current session, setting to most recent:', userSessions[0].id);
          setCurrentSession(userSessions[0]);
          setMessages(userSessions[0].messages);
        } else if (currentSession) {
          const updatedCurrentSession = userSessions.find((s) => s.id === currentSession.id);
          if (updatedCurrentSession) {
            console.log(
              'useChat: Updating current session with fresh data:',
              updatedCurrentSession.id
            );
            setCurrentSession(updatedCurrentSession);
            setMessages(updatedCurrentSession.messages);
          } else {
            console.log('useChat: Current session no longer exists, setting to most recent');
            if (userSessions.length > 0) {
              setCurrentSession(userSessions[0]);
              setMessages(userSessions[0].messages);
            } else {
              setCurrentSession(null);
              setMessages([]);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching chat sessions:', err);
        setError('Failed to load chat history');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [user]);

  const startNewChat = useCallback(async () => {
    if (!user) return null;

    try {
      setLoading(true);
      setError(null);

      const newSession = await createNewChatSession(user.id);

      const updatedSession = {
        ...newSession,
        messages: [WELCOME_MESSAGE],
      };

      setSessions((prevSessions) => [updatedSession, ...prevSessions]);
      setCurrentSession(updatedSession);
      setMessages([WELCOME_MESSAGE]);

      return updatedSession;
    } catch (err) {
      console.error('Error creating new chat:', err);
      setError('Failed to create new chat');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const sendUserMessage = useCallback(
    async (content: string) => {
      if (!user || !currentSession) return;

      try {
        setLoading(true);
        setError(null);
        const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const tempUserMsg: Message = {
          id: tempId,
          role: 'user',
          content,
          createdAt: new Date(),
        };

        setMessages((prevMessages) => [...prevMessages, tempUserMsg]);
        console.log('Sending message to API:', content);

        try {
          const updatedMessages = await sendMessage(currentSession.id, user.id, content);

          console.log('Received response from API, messages count:', updatedMessages.length);

          setMessages(updatedMessages);
          const updatedSession = {
            ...currentSession,
            messages: updatedMessages,
            updatedAt: new Date(),
          };

          setSessions((prevSessions) =>
            prevSessions.map((session) =>
              session.id === currentSession.id ? updatedSession : session
            )
          );

          setCurrentSession(updatedSession);
        } catch (err) {
          console.error('Error from sendMessage API call:', err);

          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === tempId ? { ...msg, content: msg.content + ' (Not sent - Try again)' } : msg
            )
          );
          throw err;
        }
      } catch (err) {
        console.error('Error sending message:', err);
        setError('Failed to send message. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [user, currentSession]
  );

  const switchSession = useCallback(
    (sessionId: string) => {
      const session = sessions.find((s) => s.id === sessionId);
      if (session) {
        setCurrentSession(session);
        setMessages(session.messages);
        setError(null);
        return session;
      }
      return null;
    },
    [sessions]
  );

  const switchToSession = useCallback(
    (sessionId: string) => {
      console.log('useChat: switchToSession called with:', sessionId);
      console.log('useChat: Current session before switch:', currentSession?.id);
      console.log(
        'useChat: Available sessions:',
        sessions.map((s) => s.id)
      );

      const session = sessions.find((s) => s.id === sessionId);
      if (session) {
        console.log('useChat: Found session, switching to:', session.id);
        setCurrentSession(session);
        setMessages(session.messages);
        setError(null);

        console.log('useChat: Session switch completed successfully');
        return true;
      } else {
        console.log('useChat: Session not found:', sessionId);
        return false;
      }
    },
    [sessions, currentSession]
  );

  const deleteSession = useCallback(
    async (sessionId: string) => {
      if (!user) return;

      try {
        setLoading(true);
        await deleteChatSession(sessionId);
        setSessions((prevSessions) => prevSessions.filter((s) => s.id !== sessionId));

        if (currentSession?.id === sessionId) {
          const remainingSessions = sessions.filter((s) => s.id !== sessionId);
          if (remainingSessions.length > 0) {
            setCurrentSession(remainingSessions[0]);
            setMessages(remainingSessions[0].messages);
          } else {
            setCurrentSession(null);
            setMessages([]);
          }
        }
      } catch (err) {
        console.error('Error deleting session:', err);
        setError('Failed to delete conversation');
      } finally {
        setLoading(false);
      }
    },
    [user, currentSession, sessions]
  );

  return {
    sessions,
    currentSession,
    messages,
    loading,
    error,
    startNewChat,
    sendUserMessage,
    switchSession,
    switchToSession,
    deleteSession,
  };
};
