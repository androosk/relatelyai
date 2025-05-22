// // import React, { useState, useRef, useEffect } from 'react';
// // import {
// //   View,
// //   Text,
// //   TextInput,
// //   TouchableOpacity,
// //   FlatList,
// //   KeyboardAvoidingView,
// //   Platform,
// //   ActivityIndicator,
// // } from 'react-native';
// // import { Ionicons } from '@expo/vector-icons';
// // import { useChat } from 'hooks/useChat';
// // import { Message } from 'types/chat';
// // import { format } from 'date-fns';
// // import { useNavigation } from '@react-navigation/native';
// // import { ChatScreenNavigationProp } from 'types/navigation';

// // // Helper function for safe date formatting
// // const safeFormat = (date: Date, formatString: string): string => {
// //   try {
// //     return format(date, formatString);
// //   } catch (error) {
// //     console.warn('Error formatting date:', error);
// //     return 'Just now'; // Fallback string
// //   }
// // };

// // const ChatScreen = () => {
// //   const { currentSession, messages, loading, error, startNewChat, sendUserMessage } = useChat();
// //   const navigation = useNavigation<ChatScreenNavigationProp>();

// //   const [inputText, setInputText] = useState('');
// //   const flatListRef = useRef<FlatList>(null);

// //   // Auto-scroll to bottom when messages change
// //   useEffect(() => {
// //     if (messages.length > 0 && flatListRef.current) {
// //       setTimeout(() => {
// //         flatListRef.current?.scrollToEnd({ animated: true });
// //       }, 100);
// //     }
// //   }, [messages]);

// //   // Start a new chat if there's no active session
// //   useEffect(() => {
// //     if (!currentSession) {
// //       startNewChat();
// //     }
// //   }, [currentSession, startNewChat]);

// //   const handleSend = () => {
// //     if (inputText.trim() === '' || loading) return;

// //     sendUserMessage(inputText.trim());
// //     setInputText('');
// //   };

// //   const navigateToHistory = () => {
// //     navigation.navigate('ChatHistory');
// //   };

// //   const renderMessage = ({ item }: { item: Message }) => {
// //     const isUser = item.role === 'user';

// //     return (
// //       <View
// //         className={`mb-2 max-w-[80%] rounded-2xl px-4 py-3 ${
// //           isUser
// //             ? 'self-end rounded-br-sm bg-indigo-600'
// //             : 'self-start rounded-bl-sm border border-gray-200 bg-white'
// //         }`}>
// //         <Text className={`text-base leading-[22px] ${isUser ? 'text-white' : 'text-gray-800'}`}>
// //           {item.content}
// //         </Text>
// //         <Text className="mt-1 self-end text-xs text-gray-400">
// //           {safeFormat(item.createdAt, 'h:mm a')}
// //         </Text>
// //       </View>
// //     );
// //   };

// //   const renderWelcomeMessage = () => {
// //     if (messages.length > 0) return null;

// //     return (
// //       <View className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
// //         <Text className="mb-2 text-lg font-bold text-gray-900">Welcome to Relately Chat</Text>
// //         <Text className="text-base leading-[22px] text-gray-600">
// //           I'm your relationship advisor. Feel free to ask me for advice, insights, or communication
// //           tips for your relationship.
// //         </Text>
// //       </View>
// //     );
// //   };

// //   return (
// //     <KeyboardAvoidingView
// //       className="flex-1 bg-gray-50"
// //       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
// //       keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
// //       {error ? (
// //         <View className="flex-1 items-center justify-center p-6">
// //           <Text className="mb-4 text-center text-base text-red-500">{error}</Text>
// //           <TouchableOpacity
// //             className="rounded-lg bg-indigo-600 px-5 py-2.5"
// //             onPress={() => startNewChat()}>
// //             <Text className="text-base font-bold text-white">Retry</Text>
// //           </TouchableOpacity>
// //         </View>
// //       ) : (
// //         <>
// //           <View className="flex-row items-center justify-between border-b border-gray-200 bg-white p-4">
// //             <Text className="text-lg font-bold text-indigo-600">Relationship Advisor</Text>
// //             <TouchableOpacity className="rounded-lg p-2" onPress={navigateToHistory}>
// //               <Ionicons name="list" size={24} color="#4F46E5" />
// //             </TouchableOpacity>
// //           </View>

// //           <FlatList
// //             ref={flatListRef}
// //             data={messages}
// //             renderItem={renderMessage}
// //             keyExtractor={(item) => item.id}
// //             contentContainerClassName="p-4 pb-6"
// //             ListHeaderComponent={renderWelcomeMessage}
// //             ListFooterComponent={
// //               loading && messages.length > 0 ? (
// //                 <View className="my-3 flex-row items-center self-start rounded-2xl bg-gray-100 px-3 py-1.5">
// //                   <ActivityIndicator size="small" color="#4F46E5" />
// //                   <Text className="ml-2 text-sm text-gray-600">Thinking...</Text>
// //                 </View>
// //               ) : null
// //             }
// //           />

// //           <View className="flex-row border-t border-gray-200 bg-white px-4 py-3">
// //             <TextInput
// //               className="max-h-24 flex-1 rounded-full bg-gray-100 px-4 py-2.5 text-base text-gray-800"
// //               value={inputText}
// //               onChangeText={setInputText}
// //               placeholder="Type your message..."
// //               placeholderTextColor="#9CA3AF"
// //               multiline
// //               maxLength={1000}
// //             />
// //             <TouchableOpacity
// //               className={`ml-2 h-10 w-10 items-center justify-center rounded-full ${
// //                 !inputText.trim() ? 'bg-gray-200' : 'bg-indigo-600'
// //               }`}
// //               onPress={handleSend}
// //               disabled={!inputText.trim() || loading}>
// //               <Ionicons name="send" size={20} color={!inputText.trim() ? '#9CA3AF' : '#FFFFFF'} />
// //             </TouchableOpacity>
// //           </View>
// //         </>
// //       )}
// //     </KeyboardAvoidingView>
// //   );
// // };

// // // Create a new chat session button for the header
// // export const NewChatButton = ({ onPress }: { onPress: () => void }) => (
// //   <TouchableOpacity
// //     className="mr-4 h-8 w-8 items-center justify-center rounded-full bg-indigo-600"
// //     onPress={onPress}>
// //     <Ionicons name="add" size={24} color="#FFFFFF" />
// //   </TouchableOpacity>
// // );

// // export default ChatScreen;
// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   KeyboardAvoidingView,
//   Platform,
//   ActivityIndicator,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useChat } from 'hooks/useChat';
// import { Message } from 'types/chat';
// import { format } from 'date-fns';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';
// import { ChatScreenNavigationProp } from 'types/navigation';

// // Helper function for safe date formatting
// const safeFormat = (date: Date, formatString: string): string => {
//   try {
//     return format(date, formatString);
//   } catch (error) {
//     console.warn('Error formatting date:', error);
//     return 'Just now'; // Fallback string
//   }
// };

// const ChatScreen = () => {
//   const { currentSession, messages, loading, error, startNewChat, sendUserMessage, sessions } =
//     useChat();
//   const navigation = useNavigation<ChatScreenNavigationProp>();

//   const [inputText, setInputText] = useState('');
//   const [hasInitialized, setHasInitialized] = useState(false);
//   const flatListRef = useRef<FlatList>(null);

//   // Auto-scroll to bottom when messages change
//   useEffect(() => {
//     if (messages.length > 0 && flatListRef.current) {
//       setTimeout(() => {
//         flatListRef.current?.scrollToEnd({ animated: true });
//       }, 100);
//     }
//   }, [messages]);

//   // Only handle initial setup when the component first mounts
//   // Don't interfere with navigation-based session switching
//   useEffect(() => {
//     const initializeOnMount = async () => {
//       // Only initialize if we haven't done so before
//       if (hasInitialized) return;

//       console.log('ChatScreen: Initial mount - checking for sessions...');

//       // Wait a moment for any pending data to load
//       await new Promise((resolve) => setTimeout(resolve, 200));

//       // Check if we have any sessions at all
//       if (sessions.length === 0) {
//         console.log('ChatScreen: No sessions found on mount, creating first session');
//         await startNewChat();
//       } else if (!currentSession) {
//         console.log('ChatScreen: Sessions exist but no current session, using most recent');
//         // If sessions exist but no current session is set, this will be handled by useChat
//       } else {
//         console.log('ChatScreen: Current session already exists:', currentSession.id);
//       }

//       setHasInitialized(true);
//     };

//     initializeOnMount();
//   }, []); // Empty dependency array - only run on mount

//   // Separate effect to handle when sessions data loads
//   useEffect(() => {
//     if (!hasInitialized && sessions.length > 0) {
//       console.log('ChatScreen: Sessions loaded, marking as initialized');
//       setHasInitialized(true);
//     }
//   }, [sessions.length, hasInitialized]);

//   // Reset initialization flag when navigating away and back
//   useFocusEffect(
//     React.useCallback(() => {
//       return () => {
//         // Reset when leaving the screen, but only if we're actually navigating away
//         // This allows proper re-initialization when coming back from other screens
//       };
//     }, [])
//   );

//   const handleSend = () => {
//     if (inputText.trim() === '' || loading) return;

//     sendUserMessage(inputText.trim());
//     setInputText('');
//   };

//   const navigateToHistory = () => {
//     navigation.navigate('ChatHistory');
//   };

//   const renderMessage = ({ item }: { item: Message }) => {
//     const isUser = item.role === 'user';

//     return (
//       <View
//         className={`mb-2 max-w-[80%] rounded-2xl px-4 py-3 ${
//           isUser
//             ? 'self-end rounded-br-sm bg-indigo-600'
//             : 'self-start rounded-bl-sm border border-gray-200 bg-white'
//         }`}>
//         <Text className={`text-base leading-[22px] ${isUser ? 'text-white' : 'text-gray-800'}`}>
//           {item.content}
//         </Text>
//         <Text className="mt-1 self-end text-xs text-gray-400">
//           {safeFormat(item.createdAt, 'h:mm a')}
//         </Text>
//       </View>
//     );
//   };

//   const renderWelcomeMessage = () => {
//     if (messages.length > 0) return null;

//     return (
//       <View className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
//         <Text className="mb-2 text-lg font-bold text-gray-900">Welcome to Relately Chat</Text>
//         <Text className="text-base leading-[22px] text-gray-600">
//           I'm your relationship advisor. Feel free to ask me for advice, insights, or communication
//           tips for your relationship.
//         </Text>
//       </View>
//     );
//   };

//   // Show loading state only if we haven't initialized and have no current session
//   if (!hasInitialized && !currentSession) {
//     return (
//       <View className="flex-1 items-center justify-center bg-gray-50">
//         <ActivityIndicator size="large" color="#4F46E5" />
//         <Text className="mt-4 text-base text-gray-600">Loading chat...</Text>
//       </View>
//     );
//   }

//   return (
//     <KeyboardAvoidingView
//       className="flex-1 bg-gray-50"
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//       keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
//       {error ? (
//         <View className="flex-1 items-center justify-center p-6">
//           <Text className="mb-4 text-center text-base text-red-500">{error}</Text>
//           <TouchableOpacity
//             className="rounded-lg bg-indigo-600 px-5 py-2.5"
//             onPress={() => startNewChat()}>
//             <Text className="text-base font-bold text-white">Retry</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <>
//           <View className="flex-row items-center justify-between border-b border-gray-200 bg-white p-4">
//             <Text className="text-lg font-bold text-indigo-600">Relationship Advisor</Text>
//             <TouchableOpacity className="rounded-lg p-2" onPress={navigateToHistory}>
//               <Ionicons name="list" size={24} color="#4F46E5" />
//             </TouchableOpacity>
//           </View>

//           <FlatList
//             ref={flatListRef}
//             data={messages}
//             renderItem={renderMessage}
//             keyExtractor={(item) => item.id}
//             contentContainerClassName="p-4 pb-6"
//             ListHeaderComponent={renderWelcomeMessage}
//             ListFooterComponent={
//               loading && messages.length > 0 ? (
//                 <View className="my-3 flex-row items-center self-start rounded-2xl bg-gray-100 px-3 py-1.5">
//                   <ActivityIndicator size="small" color="#4F46E5" />
//                   <Text className="ml-2 text-sm text-gray-600">Thinking...</Text>
//                 </View>
//               ) : null
//             }
//           />

//           <View className="flex-row border-t border-gray-200 bg-white px-4 py-3">
//             <TextInput
//               className="max-h-24 flex-1 rounded-full bg-gray-100 px-4 py-2.5 text-base text-gray-800"
//               value={inputText}
//               onChangeText={setInputText}
//               placeholder="Type your message..."
//               placeholderTextColor="#9CA3AF"
//               multiline
//               maxLength={1000}
//             />
//             <TouchableOpacity
//               className={`ml-2 h-10 w-10 items-center justify-center rounded-full ${
//                 !inputText.trim() ? 'bg-gray-200' : 'bg-indigo-600'
//               }`}
//               onPress={handleSend}
//               disabled={!inputText.trim() || loading}>
//               <Ionicons name="send" size={20} color={!inputText.trim() ? '#9CA3AF' : '#FFFFFF'} />
//             </TouchableOpacity>
//           </View>
//         </>
//       )}
//     </KeyboardAvoidingView>
//   );
// };

// // Create a new chat session button for the header
// export const NewChatButton = ({ onPress }: { onPress: () => void }) => (
//   <TouchableOpacity
//     className="mr-4 h-8 w-8 items-center justify-center rounded-full bg-indigo-600"
//     onPress={onPress}>
//     <Ionicons name="add" size={24} color="#FFFFFF" />
//   </TouchableOpacity>
// );

// export default ChatScreen;
import React, { useState, useRef, useEffect } from 'react';
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
import { useChat } from 'hooks/useChat';
import { Message } from 'types/chat';
import { format } from 'date-fns';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ChatScreenNavigationProp } from 'types/navigation';

// Helper function for safe date formatting
const safeFormat = (date: Date, formatString: string): string => {
  try {
    return format(date, formatString);
  } catch (error) {
    console.warn('Error formatting date:', error);
    return 'Just now'; // Fallback string
  }
};

const ChatScreen = () => {
  const { currentSession, messages, loading, error, startNewChat, sendUserMessage, sessions } =
    useChat();
  const navigation = useNavigation<ChatScreenNavigationProp>();

  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Only create a new chat if there are no sessions AND no current session
  // This runs when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log(
        'ChatScreen: Focused - currentSession:',
        currentSession?.id,
        'sessions count:',
        sessions.length
      );

      // Only create a new session if:
      // 1. There are no sessions at all, AND
      // 2. There's no current session
      // 3. We're not currently loading
      if (sessions.length === 0 && !currentSession && !loading) {
        console.log('ChatScreen: No sessions found and no current session, creating first session');
        startNewChat();
      } else if (currentSession) {
        console.log('ChatScreen: Using existing current session:', currentSession.id);
      } else if (sessions.length > 0 && !currentSession) {
        console.log('ChatScreen: Sessions exist but no current session selected');
        // In this case, useChat should handle setting the most recent session as current
        // If it doesn't, you might need to call switchToSession here
      }
    }, [sessions.length, currentSession, loading, startNewChat])
  );

  const handleSend = () => {
    if (inputText.trim() === '' || loading) return;

    sendUserMessage(inputText.trim());
    setInputText('');
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
    if (messages.length > 0) return null;

    return (
      <View className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
        <Text className="mb-2 text-lg font-bold text-gray-900">Welcome to Relately Chat</Text>
        <Text className="text-base leading-[22px] text-gray-600">
          I'm your relationship advisor. Feel free to ask me for advice, insights, or communication
          tips for your relationship.
        </Text>
      </View>
    );
  };

  // Show loading state while we're determining what to do
  if (loading && !currentSession) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text className="mt-4 text-base text-gray-600">Loading chat...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      {error ? (
        <View className="flex-1 items-center justify-center p-6">
          <Text className="mb-4 text-center text-base text-red-500">{error}</Text>
          <TouchableOpacity
            className="rounded-lg bg-indigo-600 px-5 py-2.5"
            onPress={() => startNewChat()}>
            <Text className="text-base font-bold text-white">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
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

          <View className="flex-row border-t border-gray-200 bg-white px-4 py-3">
            <TextInput
              className="max-h-24 flex-1 rounded-full bg-gray-100 px-4 py-2.5 text-base text-gray-800"
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type your message..."
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
        </>
      )}
    </KeyboardAvoidingView>
  );
};

// Create a new chat session button for the header
export const NewChatButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity
    className="mr-4 h-8 w-8 items-center justify-center rounded-full bg-indigo-600"
    onPress={onPress}>
    <Ionicons name="add" size={24} color="#FFFFFF" />
  </TouchableOpacity>
);

export default ChatScreen;
