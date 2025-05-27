import { supabase } from 'api/supabase';
import uuid from 'react-native-uuid';
import { Message, ChatSession } from '../../types/chat';
import { getChatResponse } from './aiService';
import { Tables } from 'api/database.types'; // Import your database types

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

  const messagesBySession: Record<string, Message[]> = {};

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
  console.log('ChatService: sendMessage called with sessionId:', sessionId);

  const userMsgId = uuid.v4().toString();
  const now = new Date();

  const userMessage: Message = {
    id: userMsgId,
    role: 'user',
    content,
    createdAt: now,
  };

  console.log('ChatService: Saving user message to database...');

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
    console.error('ChatService: Error saving user message:', userMsgError);
    throw new Error('Failed to save your message');
  }

  console.log('ChatService: User message saved successfully');

  let existingMessages: Tables<'chat_messages'>[] = [];

  try {
    console.log('ChatService: Fetching existing messages...');

    const { data, error: fetchError } = await supabase
      .from('chat_messages')
      .select('id, session_id, role, content, created_at')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (fetchError) {
      console.error('ChatService: Error fetching message history:', fetchError);
      throw new Error('Failed to retrieve message history');
    }

    existingMessages = data || [];
    console.log('ChatService: Fetched', existingMessages.length, 'messages');

    const messages: Message[] = existingMessages.map((msg) => ({
      id: msg.id,
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
      createdAt: safeDate(msg.created_at),
    }));

    console.log('ChatService: Calling Claude API...');

    try {
      const aiResponse = await getChatResponse(messages);
      console.log('ChatService: Received AI response:', aiResponse.substring(0, 30) + '...');

      const assistantMsgId = uuid.v4().toString();
      const assistantMsgTime = new Date();

      const assistantMessage: Message = {
        id: assistantMsgId,
        role: 'assistant',
        content: aiResponse,
        createdAt: assistantMsgTime,
      };

      console.log('ChatService: Saving AI response to database...');

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
        console.error('ChatService: Error saving AI response:', aiMsgError);
        throw new Error('Failed to save AI response');
      }

      console.log('ChatService: Updating session timestamp...');

      const { error: updateError } = await supabase
        .from('chat_sessions')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', sessionId);

      if (updateError) {
        console.error('ChatService: Error updating session timestamp:', updateError);
      }

      console.log('ChatService: Message flow completed successfully');

      return [...messages, assistantMessage];
    } catch (aiError: unknown) {
      console.error('ChatService: Error from AI service:', aiError);
      let errorMessage = 'Failed to get response from AI';
      if (aiError instanceof Error) {
        errorMessage += ': ' + aiError.message;
      } else if (typeof aiError === 'object' && aiError !== null) {
        const errorObj = aiError as Record<string, unknown>;
        if ('message' in errorObj && typeof errorObj.message === 'string') {
          errorMessage += ': ' + errorObj.message;
        }
      }
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('ChatService: Error in send message flow:', error);

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

export const deleteChatSession = async (sessionId: string): Promise<void> => {
  const { error } = await supabase.from('chat_sessions').delete().eq('id', sessionId);

  if (error) {
    console.error('Error deleting session:', error);
    throw new Error('Failed to delete conversation');
  }
};
