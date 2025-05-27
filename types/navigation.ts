import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type ChatStackParamList = {
  ChatMain: undefined;
  ChatHistory: undefined;
};

export type RootStackParamList = {
  Home: undefined;
  Quiz: undefined;
  CheckIn: undefined;
  Chat: undefined;
  Resources: undefined;
};

export type ChatScreenNavigationProp = NativeStackNavigationProp<ChatStackParamList, 'ChatMain'>;
export type ChatHistoryScreenNavigationProp = NativeStackNavigationProp<
  ChatStackParamList,
  'ChatHistory'
>;
