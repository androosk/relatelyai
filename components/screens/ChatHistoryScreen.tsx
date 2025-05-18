import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useChat } from 'hooks/useChat';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { ChatSession } from 'types/chat';
import { ChatHistoryScreenNavigationProp } from '../../types/navigation';

// Helper function for safe date formatting
const safeFormat = (date: Date, formatString: string): string => {
  try {
    return format(date, formatString);
  } catch (error) {
    console.warn('Error formatting date:', error);
    return 'Recent'; // Fallback string
  }
};

const ChatHistoryScreen = () => {
  const { sessions, switchSession, deleteSession } = useChat();
  const navigation = useNavigation<ChatHistoryScreenNavigationProp>();

  const handleSelectSession = (sessionId: string) => {
    switchSession(sessionId);
    navigation.navigate('Chat');
  };

  const handleDeleteSession = (sessionId: string) => {
    deleteSession(sessionId);
  };

  const renderSessionItem = ({ item }: { item: ChatSession }) => {
    // Get first message content or placeholder
    const previewText =
      item.messages.length > 0
        ? item.messages[0].content.substring(0, 60) +
          (item.messages[0].content.length > 60 ? '...' : '')
        : 'New conversation';

    return (
      <TouchableOpacity
        className="mb-3 rounded-xl border border-gray-200 bg-white p-4"
        onPress={() => handleSelectSession(item.id)}>
        <View className="flex-row justify-between">
          <Text className="mb-2 text-sm font-bold text-indigo-600">
            {safeFormat(item.updatedAt, 'MMM d, yyyy')}
          </Text>
          <TouchableOpacity
            className="rounded-full p-1"
            onPress={() => handleDeleteSession(item.id)}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <Text className="text-red-500">Delete</Text>
          </TouchableOpacity>
        </View>
        <Text className="mb-2 text-base text-gray-800">{previewText}</Text>
        <Text className="text-sm text-gray-500">
          {item.messages.length} {item.messages.length === 1 ? 'message' : 'messages'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Text className="m-4 text-xl font-bold text-gray-900">Your Conversations</Text>
      {sessions.length === 0 ? (
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-center text-base text-gray-500">
            No conversations yet. Start a new chat to get relationship advice.
          </Text>
        </View>
      ) : (
        <FlatList
          data={sessions}
          renderItem={renderSessionItem}
          keyExtractor={(item) => item.id}
          contentContainerClassName="p-4"
        />
      )}
    </View>
  );
};

export default ChatHistoryScreen;
