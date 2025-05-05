// navigation/QuizStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import QuizScreen from 'components/screens/QuizScreen';
import RelationshipHealthQuiz from 'components/screens/RelationshipHealthQuiz';
import StayOrLeaveQuiz from 'components/screens/StayOrLeaveQuiz';

export type QuizStackParamList = {
  QuizHome: undefined;
  RelationshipHealthQuiz: undefined;
  StayOrLeaveQuiz: undefined;
};

const Stack = createNativeStackNavigator<QuizStackParamList>();

export function QuizStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerTintColor: '#6366f1' }}>
      <Stack.Screen
        name="QuizHome"
        component={QuizScreen}
        options={{ title: 'Choose a Quiz', headerShown: false }}
      />
      <Stack.Screen
        name="RelationshipHealthQuiz"
        component={RelationshipHealthQuiz}
        options={{ title: 'Relationship Health Check' }}
      />
      <Stack.Screen
        name="StayOrLeaveQuiz"
        component={StayOrLeaveQuiz}
        options={{ title: 'Should I Stay or Leave?' }}
      />
    </Stack.Navigator>
  );
}
