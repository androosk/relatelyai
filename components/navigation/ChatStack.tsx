import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatScreen, { NewChatButton } from '../screens/ChatScreen';
import ChatHistoryScreen from '../screens/ChatHistoryScreen';
import { useChat } from '../../hooks/useChat';

// Define the chat stack param list
export type ChatStackParamList = {
  ChatMain: undefined;
  ChatHistory: undefined;
};

const Stack = createNativeStackNavigator<ChatStackParamList>();

export const ChatStackNavigator = () => {
  const { startNewChat } = useChat();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChatMain"
        component={ChatScreen}
        options={({ navigation }) => ({
          title: 'Relationship Advisor',
          headerRight: () => (
            <NewChatButton
              onPress={() => {
                startNewChat().then(() => {
                  // Focus stays on the chat screen, but with a new session
                });
              }}
            />
          ),
        })}
      />
      <Stack.Screen
        name="ChatHistory"
        component={ChatHistoryScreen}
        options={{
          title: 'Chat History',
        }}
      />
    </Stack.Navigator>
  );
};
