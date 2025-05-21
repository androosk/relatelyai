// import { View, Text, FlatList, TouchableOpacity } from 'react-native';
// import { useChat } from 'hooks/useChat';
// import { format } from 'date-fns';
// import { useNavigation } from '@react-navigation/native';
// import { ChatSession } from 'types/chat';
// import { ChatHistoryScreenNavigationProp } from '../../types/navigation';

// // Helper function for safe date formatting
// const safeFormat = (date: Date, formatString: string): string => {
//   try {
//     return format(date, formatString);
//   } catch (error) {
//     console.warn('Error formatting date:', error);
//     return 'Recent'; // Fallback string
//   }
// };

// const ChatHistoryScreen = () => {
//   const { sessions, switchSession, deleteSession } = useChat();
//   const navigation = useNavigation<ChatHistoryScreenNavigationProp>();

//   const handleSelectSession = (sessionId: string) => {
//     switchSession(sessionId);
//     navigation.navigate('Chat');
//   };

//   const handleDeleteSession = (sessionId: string) => {
//     deleteSession(sessionId);
//   };

//   const renderSessionItem = ({ item }: { item: ChatSession }) => {
//     // Get first message content or placeholder
//     const previewText =
//       item.messages.length > 0
//         ? item.messages[0].content.substring(0, 60) +
//           (item.messages[0].content.length > 60 ? '...' : '')
//         : 'New conversation';

//     return (
//       <TouchableOpacity
//         className="mb-3 rounded-xl border border-gray-200 bg-white p-4"
//         onPress={() => handleSelectSession(item.id)}>
//         <View className="flex-row justify-between">
//           <Text className="mb-2 text-sm font-bold text-indigo-600">
//             {safeFormat(item.updatedAt, 'MMM d, yyyy')}
//           </Text>
//           <TouchableOpacity
//             className="rounded-full p-1"
//             onPress={() => handleDeleteSession(item.id)}
//             hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
//             <Text className="text-red-500">Delete</Text>
//           </TouchableOpacity>
//         </View>
//         <Text className="mb-2 text-base text-gray-800">{previewText}</Text>
//         <Text className="text-sm text-gray-500">
//           {item.messages.length} {item.messages.length === 1 ? 'message' : 'messages'}
//         </Text>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View className="flex-1 bg-gray-50">
//       <Text className="m-4 text-xl font-bold text-gray-900">Your Conversations</Text>
//       {sessions.length === 0 ? (
//         <View className="flex-1 items-center justify-center p-6">
//           <Text className="text-center text-base text-gray-500">
//             No conversations yet. Start a new chat to get relationship advice.
//           </Text>
//         </View>
//       ) : (
//         <FlatList
//           data={sessions}
//           renderItem={renderSessionItem}
//           keyExtractor={(item) => item.id}
//           contentContainerClassName="p-4"
//         />
//       )}
//     </View>
//   );
// };

// export default ChatHistoryScreen;
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useChat } from '../../hooks/useChat';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { ChatSession } from '../../types/chat';
import { ChatHistoryScreenNavigationProp } from '../../types/navigation';
import { Ionicons } from '@expo/vector-icons';

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
    // Switch to the selected session
    switchToSession(session.id);

    // Navigate back to the chat screen
    navigation.navigate('ChatMain');
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
