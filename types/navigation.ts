import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define the parameter list for each route
export type RootStackParamList = {
  Home: undefined;
  Quiz: undefined;
  CheckIn: undefined;
  Chat: undefined;
  ChatHistory: undefined;
  Resources: undefined;
  // Add any other screens with their params
};

// Create reusable navigation prop types
export type ChatScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Chat'>;
export type ChatHistoryScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ChatHistory'
>;

// Then in your ChatHistoryScreen, you can use it like this:
// const navigation = useNavigation<ChatHistoryScreenNavigationProp>();
