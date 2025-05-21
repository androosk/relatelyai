import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type ChatStackParamList = {
  ChatMain: undefined;
  ChatHistory: undefined;
};

// Define the parameter list for each route
export type RootStackParamList = {
  Home: undefined;
  Quiz: undefined;
  CheckIn: undefined;
  Chat: undefined;
  // ChatHistory: undefined;
  Resources: undefined;
  // Add any other screens with their params
};

// Create reusable navigation prop types
export type ChatScreenNavigationProp = NativeStackNavigationProp<ChatStackParamList, 'ChatMain'>;
export type ChatHistoryScreenNavigationProp = NativeStackNavigationProp<
  ChatStackParamList,
  'ChatHistory'
>;

// Then in your ChatHistoryScreen, you can use it like this:
// const navigation = useNavigation<ChatHistoryScreenNavigationProp>();
