import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  QuizScreen: undefined;
  RelationshipHealthQuiz: undefined;
  StayOrLeaveQuiz: undefined;
};

type QuizScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'QuizScreen'>;

const QuizScreen: React.FC = () => {
  const navigation = useNavigation<QuizScreenNavigationProp>();

  return (
    <SafeAreaView className="flex-1 bg-white p-6">
      <Text className="mb-8 text-center text-2xl font-bold text-indigo-600">
        Which quiz would you like to take?
      </Text>

      <TouchableOpacity
        className="mb-4 rounded-xl bg-indigo-500 px-6 py-4"
        onPress={() => navigation.navigate('RelationshipHealthQuiz')}>
        <Text className="text-center text-lg font-semibold text-white">
          Relationship Health Check
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="rounded-xl bg-pink-500 px-6 py-4"
        onPress={() => navigation.navigate('StayOrLeaveQuiz')}>
        <Text className="text-center text-lg font-semibold text-white">
          Should I Stay or Leave?
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default QuizScreen;
