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

  // Welcome message for new chats
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

  // Fetch chat sessions for current user
  useEffect(() => {
    if (!user) return;

    const fetchSessions = async () => {
      try {
        setLoading(true);
        const userSessions = await getChatSessions(user.id);
        setSessions(userSessions);

        // Set current session to the most recent one if available
        if (userSessions.length > 0) {
          setCurrentSession(userSessions[0]);
          setMessages(userSessions[0].messages);
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

  // Create a new chat session
  const startNewChat = useCallback(async () => {
    if (!user) return null;

    try {
      setLoading(true);
      setError(null);

      const newSession = await createNewChatSession(user.id);

      // Add the welcome message
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

  // Send a message in the current session
  const sendUserMessage = useCallback(
    async (content: string) => {
      if (!user || !currentSession) return;

      try {
        setLoading(true);
        setError(null);

        // Generate a unique message ID to prevent duplicates
        const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        // Optimistically update UI with user message
        const tempUserMsg: Message = {
          id: tempId,
          role: 'user',
          content,
          createdAt: new Date(),
        };

        // Update UI with temporary message
        setMessages((prevMessages) => [...prevMessages, tempUserMsg]);

        // Log before API call
        console.log('Sending message to API:', content);

        // Send message and get response
        try {
          const updatedMessages = await sendMessage(currentSession.id, user.id, content);

          console.log('Received response from API, messages count:', updatedMessages.length);

          // Replace our temporary version with the real saved messages
          setMessages(updatedMessages);

          // Update session in the sessions list
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

          // If API call fails, keep the temporary message but mark it as error
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === tempId ? { ...msg, content: msg.content + ' (Not sent - Try again)' } : msg
            )
          );
          throw err; // Re-throw to be caught by outer catch
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

  // Switch to a different chat session
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

  // Switch to a session and optionally return it for navigation purposes
  const switchToSession = useCallback(
    (sessionId: string) => {
      return switchSession(sessionId);
    },
    [switchSession]
  );

  // Delete a chat session
  const deleteSession = useCallback(
    async (sessionId: string) => {
      if (!user) return;

      try {
        setLoading(true);

        await deleteChatSession(sessionId);

        // Update local state
        setSessions((prevSessions) => prevSessions.filter((s) => s.id !== sessionId));

        // If the deleted session was the current one, switch to another one
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
    switchToSession, // Add this for explicit navigation use
    deleteSession,
  };
};
