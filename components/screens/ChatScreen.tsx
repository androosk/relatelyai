import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useChat } from 'components/contexts/ChatContext';
import { Message } from 'types/chat';
import { format } from 'date-fns';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ChatScreenNavigationProp } from 'types/navigation';
import { GradientBackground } from 'components/ui/GradientBackground';

const safeFormat = (date: Date, formatString: string): string => {
  try {
    return format(date, formatString);
  } catch (error) {
    console.warn('Error formatting date:', error);
    return 'Just now';
  }
};

const ChatScreen = () => {
  const { currentSession, messages, loading, error, startNewChat, sendUserMessage, sessions } =
    useChat();
  const navigation = useNavigation<ChatScreenNavigationProp>();

  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          className="mr-4 h-8 w-8 items-center justify-center rounded-full bg-indigo-600"
          onPress={() => {
            startNewChat()
              .then(() => {
                console.log('New chat started from header button');
              })
              .catch((error) => {
                console.error('Failed to start new chat:', error);
              });
          }}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, startNewChat]);

  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  useFocusEffect(
    React.useCallback(() => {
      console.log(
        'ChatScreen: Focused - currentSession:',
        currentSession?.id,
        'sessions count:',
        sessions.length
      );

      if (currentSession) {
        console.log('ChatScreen: Using existing current session:', currentSession.id);
      } else if (sessions.length > 0) {
        console.log('ChatScreen: Sessions exist but no current session selected');
      } else {
        console.log('ChatScreen: No sessions exist, waiting for user to start chatting');
      }
    }, [sessions.length, currentSession])
  );

  const handleSend = async () => {
    if (inputText.trim() === '' || loading) return;

    const messageText = inputText.trim();
    setInputText('');

    if (!currentSession) {
      console.log('ChatScreen: No current session, creating new session before sending message');
      try {
        await startNewChat();
        sendUserMessage(messageText);
      } catch (error) {
        console.error('ChatScreen: Failed to create new session:', error);
        setInputText(messageText);
      }
    } else {
      sendUserMessage(messageText);
    }
  };

  const navigateToHistory = () => {
    navigation.navigate('ChatHistory');
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';

    return (
      <View
        className={`mb-2 max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'self-end rounded-br-sm bg-indigo-600'
            : 'self-start rounded-bl-sm border border-gray-200 bg-white'
        }`}>
        <Text className={`text-base leading-[22px] ${isUser ? 'text-white' : 'text-gray-800'}`}>
          {item.content}
        </Text>
        <Text className="mt-1 self-end text-xs text-gray-400">
          {safeFormat(item.createdAt, 'h:mm a')}
        </Text>
      </View>
    );
  };

  const renderWelcomeMessage = () => {
    if (currentSession && messages.length > 0) return null;

    return (
      <View className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
        <Text className="mb-2 text-lg font-bold text-gray-900">Welcome to Relately Chat</Text>
        <Text className="text-base leading-[22px] text-gray-600">
          I'm your relationship advisor. Feel free to ask me for advice, insights, or communication
          tips for your relationship.
        </Text>
        {!currentSession && sessions.length > 0 && (
          <Text className="mt-3 text-sm text-gray-500">
            💡 You can also view your previous conversations by tapping the list icon above.
          </Text>
        )}
      </View>
    );
  };

  if (error) {
    return (
      <KeyboardAvoidingView
        className="flex-1 bg-gray-50"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <View className="flex-row items-center justify-between border-b border-gray-200 bg-white p-4">
          <Text className="text-lg font-bold text-indigo-600">Relationship Advisor</Text>
          <TouchableOpacity className="rounded-lg p-2" onPress={navigateToHistory}>
            <Ionicons name="list" size={24} color="#4F46E5" />
          </TouchableOpacity>
        </View>

        <View className="flex-1 items-center justify-center p-6">
          <Text className="mb-4 text-center text-base text-red-500">{error}</Text>
          <TouchableOpacity
            className="rounded-lg bg-indigo-600 px-5 py-2.5"
            onPress={() => {
              if (currentSession) {
                // Try to refresh current session or clear error
              } else {
                startNewChat();
              }
            }}>
            <Text className="text-base font-bold text-white">Retry</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <View className="flex-row items-center justify-between border-b border-gray-200 bg-white p-4">
          <Text className="text-lg font-bold text-indigo-600">Relationship Advisor</Text>
          <TouchableOpacity className="rounded-lg p-2" onPress={navigateToHistory}>
            <Ionicons name="list" size={24} color="#4F46E5" />
          </TouchableOpacity>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerClassName="p-4 pb-6"
          ListHeaderComponent={renderWelcomeMessage}
          ListFooterComponent={
            loading && messages.length > 0 ? (
              <View className="my-3 flex-row items-center self-start rounded-2xl bg-gray-100 px-3 py-1.5">
                <ActivityIndicator size="small" color="#4F46E5" />
                <Text className="ml-2 text-sm text-gray-600">Thinking...</Text>
              </View>
            ) : null
          }
        />

        <View className="flex-row px-4 py-3">
          <TextInput
            className="max-h-24 flex-1 rounded-full bg-gray-100 px-4 py-2.5 text-base text-gray-800"
            value={inputText}
            onChangeText={setInputText}
            placeholder={
              currentSession
                ? 'Type your message...'
                : sessions.length > 0
                  ? 'Start a new conversation...'
                  : 'Type your first message...'
            }
            placeholderTextColor="#9CA3AF"
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            className={`ml-2 h-10 w-10 items-center justify-center rounded-full ${
              !inputText.trim() ? 'bg-gray-200' : 'bg-indigo-600'
            }`}
            onPress={handleSend}
            disabled={!inputText.trim() || loading}>
            <Ionicons name="send" size={20} color={!inputText.trim() ? '#9CA3AF' : '#FFFFFF'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

export const NewChatButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity
    className="mr-4 h-8 w-8 items-center justify-center rounded-full bg-indigo-600"
    onPress={onPress}>
    <Ionicons name="add" size={24} color="#FFFFFF" />
  </TouchableOpacity>
);

export default ChatScreen;
