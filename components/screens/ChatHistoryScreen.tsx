import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
// import { useChat } from 'hooks/useChat';
import { useChat } from 'components/contexts/ChatContext';
import { ChatSession } from 'types/chat';
import { format } from 'date-fns';
import { ChatHistoryScreenNavigationProp } from 'types/navigation';

// Helper function for safe date formatting
const safeFormat = (date: Date, formatString: string): string => {
  try {
    return format(date, formatString);
  } catch (error) {
    console.warn('Error formatting date:', error);
    return 'Recently'; // Fallback string
  }
};

const ChatHistoryScreen = () => {
  const navigation = useNavigation<ChatHistoryScreenNavigationProp>();
  const { sessions, currentSession, switchToSession, deleteSession, loading } = useChat();

  const handleSelectSession = (session: ChatSession) => {
    console.log('ChatHistory: Selecting session:', session.id);
    console.log('ChatHistory: Current session before switch:', currentSession?.id);

    // Switch to the selected session
    const switched = switchToSession(session.id);

    console.log('ChatHistory: switchToSession returned:', switched);

    if (switched) {
      console.log('ChatHistory: Session switched successfully, navigating back');
      // Navigate back to the chat screen
      navigation.navigate('ChatMain');
    } else {
      console.log('ChatHistory: Failed to switch session');
      // Optionally show an error message to the user
    }
  };

  const handleDeleteSession = (session: ChatSession) => {
    Alert.alert(
      'Delete Conversation',
      'Are you sure you want to delete this conversation? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteSession(session.id),
        },
      ]
    );
  };

  const getSessionPreview = (session: ChatSession): string => {
    if (session.messages.length === 0) {
      return 'New conversation';
    }

    // Find the first user message (skip welcome messages)
    const firstUserMessage = session.messages.find((msg) => msg.role === 'user');
    if (firstUserMessage) {
      return firstUserMessage.content.length > 50
        ? firstUserMessage.content.substring(0, 50) + '...'
        : firstUserMessage.content;
    }

    return 'New conversation';
  };

  const renderSessionItem = ({ item }: { item: ChatSession }) => {
    const isCurrentSession = currentSession?.id === item.id;
    const preview = getSessionPreview(item);
    const lastMessageTime =
      item.messages.length > 0 ? item.messages[item.messages.length - 1].createdAt : item.createdAt;

    return (
      <TouchableOpacity
        className={`mb-2 rounded-lg border p-4 ${
          isCurrentSession ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200 bg-white'
        }`}
        onPress={() => handleSelectSession(item)}
        disabled={loading}>
        <View className="flex-row items-start justify-between">
          <View className="mr-3 flex-1">
            <Text
              className={`text-base font-medium ${
                isCurrentSession ? 'text-indigo-900' : 'text-gray-900'
              }`}
              numberOfLines={2}>
              {preview}
            </Text>
            <Text className="mt-1 text-sm text-gray-500">
              {safeFormat(lastMessageTime, 'MMM d, yyyy • h:mm a')}
            </Text>
            <Text className="mt-1 text-xs text-gray-400">{item.messages.length} messages</Text>
          </View>

          <View className="flex-row items-center">
            {isCurrentSession && (
              <View className="mr-2 rounded-full bg-indigo-600 px-2 py-1">
                <Text className="text-xs font-medium text-white">Active</Text>
              </View>
            )}
            <TouchableOpacity
              className="rounded-full p-2"
              onPress={() => handleDeleteSession(item)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center p-8">
      <Ionicons name="chatbubbles-outline" size={64} color="#9CA3AF" />
      <Text className="mt-4 text-lg font-medium text-gray-500">No conversations yet</Text>
      <Text className="mt-2 text-center text-base text-gray-400">
        Start a new conversation to see your chat history here
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {sessions.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={sessions}
          renderItem={renderSessionItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default ChatHistoryScreen;
