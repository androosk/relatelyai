import { supabase } from 'api/supabase';
import uuid from 'react-native-uuid';
import { Message, ChatSession } from '../../types/chat';
import { getChatResponse } from './aiService';
import { Tables } from 'api/database.types'; // Import your database types

// Helper function to safely create Date objects
const safeDate = (dateString: string | null): Date => {
  return dateString ? new Date(dateString) : new Date();
};

export const createNewChatSession = async (userId: string): Promise<ChatSession> => {
  const sessionId = uuid.v4().toString();
  const now = new Date();

  const newSession: ChatSession = {
    id: sessionId,
    userId,
    messages: [],
    createdAt: now,
    updatedAt: now,
  };

  const { error } = await supabase.from('chat_sessions').insert([
    {
      id: sessionId,
      user_id: userId,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    },
  ]);

  if (error) {
    console.error('Error creating chat session:', error);
    throw new Error('Failed to create chat session');
  }

  return newSession;
};

export const getChatSessions = async (userId: string): Promise<ChatSession[]> => {
  // First get all chat sessions
  const { data: sessionsData, error: sessionsError } = await supabase
    .from('chat_sessions')
    .select('id, user_id, created_at, updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (sessionsError) {
    console.error('Error fetching chat sessions:', sessionsError);
    throw new Error('Failed to fetch chat sessions');
  }

  if (!sessionsData || sessionsData.length === 0) {
    return [];
  }

  // Then get all messages for these sessions
  const sessionIds = sessionsData.map((session) => session.id);

  const { data: messagesData, error: messagesError } = await supabase
    .from('chat_messages')
    .select('id, session_id, role, content, created_at')
    .in('session_id', sessionIds)
    .order('created_at', { ascending: true });

  if (messagesError) {
    console.error('Error fetching chat messages:', messagesError);
    throw new Error('Failed to fetch chat messages');
  }

  // Organize messages by session
  const messagesBySession: Record<string, Message[]> = {};

  // Use your database types
  const typedMessagesData = (messagesData as Tables<'chat_messages'>[]) || [];

  typedMessagesData.forEach((msg) => {
    if (!messagesBySession[msg.session_id]) {
      messagesBySession[msg.session_id] = [];
    }

    messagesBySession[msg.session_id].push({
      id: msg.id,
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
      createdAt: safeDate(msg.created_at),
    });
  });

  // Combine sessions with their messages
  // Use your database types
  const typedSessionsData = sessionsData as Tables<'chat_sessions'>[];

  return typedSessionsData.map((session) => ({
    id: session.id,
    userId: session.user_id,
    messages: messagesBySession[session.id] || [],
    createdAt: safeDate(session.created_at),
    updatedAt: safeDate(session.updated_at),
  }));
};

export const sendMessage = async (
  sessionId: string,
  userId: string,
  content: string
): Promise<Message[]> => {
  // Create user message
  const userMsgId = uuid.v4().toString();
  const now = new Date();

  const userMessage: Message = {
    id: userMsgId,
    role: 'user',
    content,
    createdAt: now,
  };

  // Save user message to database
  const { error: userMsgError } = await supabase.from('chat_messages').insert([
    {
      id: userMsgId,
      session_id: sessionId,
      role: 'user',
      content,
      created_at: now.toISOString(),
    },
  ]);

  if (userMsgError) {
    console.error('Error saving user message:', userMsgError);
    throw new Error('Failed to save your message');
  }

  // Use your existing database types
  let existingMessages: Tables<'chat_messages'>[] = [];

  try {
    // Get existing messages for context
    const { data, error: fetchError } = await supabase
      .from('chat_messages')
      .select('id, session_id, role, content, created_at')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (fetchError) {
      console.error('Error fetching message history:', fetchError);
      throw new Error('Failed to retrieve message history');
    }

    existingMessages = data || [];

    const messages: Message[] = existingMessages.map((msg) => ({
      id: msg.id,
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
      createdAt: safeDate(msg.created_at),
    }));

    // Get AI response
    const aiResponse = await getChatResponse(messages);

    // Create assistant message
    const assistantMsgId = uuid.v4().toString();
    const assistantMsgTime = new Date();

    const assistantMessage: Message = {
      id: assistantMsgId,
      role: 'assistant',
      content: aiResponse,
      createdAt: assistantMsgTime,
    };

    // Save assistant message to database
    const { error: aiMsgError } = await supabase.from('chat_messages').insert([
      {
        id: assistantMsgId,
        session_id: sessionId,
        role: 'assistant',
        content: aiResponse,
        created_at: assistantMsgTime.toISOString(),
      },
    ]);

    if (aiMsgError) {
      console.error('Error saving AI response:', aiMsgError);
      throw new Error('Failed to save AI response');
    }

    // Update session 'updated_at' timestamp
    const { error: updateError } = await supabase
      .from('chat_sessions')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', sessionId);

    if (updateError) {
      console.error('Error updating session timestamp:', updateError);
      // Not throwing here as it's not critical
    }

    // Return updated messages list
    return [...messages, assistantMessage];
  } catch (error) {
    console.error('Error in send message flow:', error);

    // If AI fails, still keep the user message
    return [
      ...existingMessages.map((msg) => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        createdAt: safeDate(msg.created_at),
      })),
      userMessage,
    ];
  }
};

export const deleteSession = async (sessionId: string): Promise<void> => {
  // Delete the session (messages will cascade delete due to foreign key constraint)
  const { error } = await supabase.from('chat_sessions').delete().eq('id', sessionId);

  if (error) {
    console.error('Error deleting session:', error);
    throw new Error('Failed to delete conversation');
  }
};
