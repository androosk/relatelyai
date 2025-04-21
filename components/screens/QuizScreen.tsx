import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QuizQuestion from '../ui/QuizQuestion';

const relationshipQuestions = [
  {
    id: 1,
    question: 'How often do you and your partner have meaningful conversations?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'],
  },
  {
    id: 2,
    question: 'Do you feel respected by your partner?',
    options: ['Not at all', 'Occasionally', 'Neutral', 'Most of the time', 'Always'],
  },
  {
    id: 3,
    question: 'How often do you argue with your partner?',
    options: ['Daily', 'Several times a week', 'Weekly', 'Monthly', 'Rarely'],
  },
  {
    id: 4,
    question: 'Do you feel your partner listens to you?',
    options: ['Never', 'Rarely', 'Sometimes', 'Usually', 'Always'],
  },
  {
    id: 5,
    question: 'Do you trust your partner completely?',
    options: ['Not at all', 'Somewhat', 'Neutral', 'Mostly', 'Completely'],
  },
  // Add more questions as needed
];

export default function QuizScreen() {
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId: number, answerIndex: number) => {
    setAnswers({ ...answers, [questionId]: answerIndex });
  };

  const calculateScore = () => {
    let totalScore = 0;
    let answeredQuestions = 0;

    Object.keys(answers).forEach((questionId) => {
      // Different scoring logic based on the question
      // For now, we'll use a simple approach where higher index = better (except for arguments)
      const qId = parseInt(questionId);
      let score = answers[qId];

      // Reverse score for negative questions (like argument frequency)
      if (qId === 3) {
        score = 4 - score;
      }

      totalScore += score;
      answeredQuestions++;
    });

    if (answeredQuestions === 0) return 0;
    return (totalScore / (answeredQuestions * 4)) * 100; // Convert to percentage
  };

  const getRelationshipAdvice = () => {
    const score = calculateScore();

    if (score >= 80) {
      return 'Your relationship appears to be healthy and thriving. Keep communicating and appreciating each other.';
    } else if (score >= 60) {
      return 'Your relationship has strengths, but there may be areas that need attention. Consider discussing these with your partner.';
    } else if (score >= 40) {
      return 'Your relationship has some significant challenges. Consider relationship counseling to address these issues.';
    } else {
      return 'Your relationship shows several concerning signs. It may be time to evaluate whether this relationship is healthy for you.';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-4 py-6">
        <Text className="mb-6 text-2xl font-bold text-indigo-600">Relationship Health Quiz</Text>

        {!showResults ? (
          <>
            {relationshipQuestions.map((q) => (
              <QuizQuestion
                key={q.id}
                question={q.question}
                options={q.options}
                selectedOption={answers[q.id] !== undefined ? answers[q.id] : -1}
                onSelect={(index) => handleAnswer(q.id, index)}
              />
            ))}

            <TouchableOpacity
              className="mt-6 rounded-lg bg-indigo-600 px-6 py-3"
              onPress={() => setShowResults(true)}>
              <Text className="text-center font-semibold text-white">See Results</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View className="rounded-lg bg-white p-6 shadow">
            <Text className="mb-4 text-center text-xl font-bold">Your Relationship Score</Text>
            <View className="mb-6 h-32 w-32 items-center justify-center self-center rounded-full bg-indigo-100">
              <Text className="text-3xl font-bold text-indigo-600">
                {Math.round(calculateScore())}%
              </Text>
            </View>

            <Text className="mb-4 text-lg">{getRelationshipAdvice()}</Text>

            <TouchableOpacity
              className="mt-4 rounded-lg bg-indigo-600 px-6 py-3"
              onPress={() => {
                setShowResults(false);
                setAnswers({});
              }}>
              <Text className="text-center font-semibold text-white">Retake Quiz</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
