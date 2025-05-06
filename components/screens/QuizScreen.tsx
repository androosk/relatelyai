import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { quizService } from 'components/services/quizService';
import { format } from 'date-fns';

type RootStackParamList = {
  QuizScreen: undefined;
  RelationshipHealthQuiz: undefined;
  StayOrLeaveQuiz: undefined;
};

type QuizScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'QuizScreen'>;

const QuizScreen: React.FC = () => {
  const navigation = useNavigation<QuizScreenNavigationProp>();
  const [quizResults, setQuizResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Add a listener for when the screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      fetchQuizResults();
    });

    // Initial fetch
    fetchQuizResults();

    // Cleanup
    return unsubscribe;
  }, [navigation]);

  const fetchQuizResults = async () => {
    setLoading(true);
    try {
      const results = await quizService.getQuizHistory();
      setQuizResults(results);
    } catch (err) {
      console.error('Failed to fetch quiz results:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatQuizType = (type: string) => {
    switch (type) {
      case 'relationship':
        return 'Relationship Health Check';
      case 'stayorleave':
        return 'Should I Stay or Leave?';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Unknown date';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="mb-8 text-center text-2xl font-bold text-indigo-600">
          Which assessment would you like to take?
        </Text>

        <TouchableOpacity
          className="mb-4 rounded-xl bg-indigo-500 px-6 py-4"
          onPress={() => navigation.navigate('RelationshipHealthQuiz')}>
          <Text className="text-center text-lg font-semibold text-white">
            Relationship Health Check
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mb-8 rounded-xl bg-pink-500 px-6 py-4"
          onPress={() => navigation.navigate('StayOrLeaveQuiz')}>
          <Text className="text-center text-lg font-semibold text-white">
            Should I Stay or Leave?
          </Text>
        </TouchableOpacity>

        {/* Past Quiz Results Section */}
        <View className="mt-6">
          <Text className="mb-4 text-xl font-bold text-gray-800">
            Your Recent Assessment Results
          </Text>

          {loading ? (
            <ActivityIndicator color="#6366F1" size="large" />
          ) : quizResults.length > 0 ? (
            quizResults.map((quiz) => (
              <View key={quiz.id} className="mb-4 rounded-lg bg-gray-50 p-4 shadow-sm">
                <View className="flex-row justify-between">
                  <Text className="font-medium text-gray-900">
                    {formatQuizType(quiz.quiz_type || 'unknown')}
                  </Text>
                  <Text className="text-gray-500">{formatDate(quiz.created_at)}</Text>
                </View>
                <View className="mt-2 flex-row items-center">
                  <Text className="text-gray-700">Score: </Text>
                  <Text className="font-semibold text-indigo-600">{quiz.score}%</Text>
                </View>
                <Text className="mt-1 text-gray-600">{quiz.assessment}</Text>
                {quiz.recommendation && (
                  <Text className="mt-2 italic text-indigo-500" numberOfLines={1}>
                    Recommendation: {quiz.recommendation}
                  </Text>
                )}
              </View>
            ))
          ) : (
            <Text className="italic text-gray-500">
              No assessment results yet. Complete an assessment to see your results here!
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default QuizScreen;
