// ChatScreen.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm RelatelyAI. How can I help with your relationship questions today?",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

  // Mock AI responses - in production, you'd connect to an AI service
  const relationshipResponses = [
    'Communication is key in any relationship. Have you tried setting aside dedicated time to talk?',
    "It sounds like you might be experiencing some trust issues. Can you tell me more about what's causing these feelings?",
    'Boundaries are important in healthy relationships. Consider discussing your needs openly with your partner.',
    'Many couples find that scheduling regular date nights helps them stay connected.',
    "It's normal to have disagreements. The important thing is how you work through them together.",
    'Self-care is important too. Taking time for yourself can actually benefit your relationship.',
  ];

  const getAIResponse = (userMessage: string) => {
    // Basic mock response - in production, you'd connect to a proper AI service
    // For now, just selecting a random response
    const randomIndex = Math.floor(Math.random() * relationshipResponses.length);
    return relationshipResponses[randomIndex];
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: input.trim(),
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Simulate AI response (with slight delay)
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(input),
        isUser: false,
      };
      setMessages((prev) => [...prev, aiResponse]);

      // Scroll to bottom
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 1000);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      className={`max-w-4/5 my-1 rounded-lg p-3 ${
        item.isUser ? 'self-end bg-indigo-600' : 'self-start bg-gray-200'
      }`}>
      <Text className={item.isUser ? 'text-white' : 'text-gray-800'}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <View className="flex-1 px-4 pt-2">
          <Text className="mb-4 text-xl font-bold text-indigo-600">Relationship Advisor</Text>

          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 10 }}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />

          <View className="mb-4 flex-row items-center rounded-full border border-gray-300 px-4 py-2">
            <TextInput
              className="flex-1 text-base"
              placeholder="Type your message..."
              value={input}
              onChangeText={setInput}
              multiline
            />
            <TouchableOpacity onPress={sendMessage} disabled={!input.trim()}>
              <FontAwesome name="send" size={20} color={input.trim() ? '#4f46e5' : '#d1d5db'} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
