import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QuizQuestion from 'components/ui/QuizQuestion';
import { supabase } from 'api/supabase';
import { quizService, Question } from 'components/services/quizService';

const questions: Question[] = [
  {
    id: 1,
    question: 'How well does your partner meet your needs?',
    options: ['Not at all', 'Slightly', 'Moderately', 'Mostly', 'Completely'],
  },
  {
    id: 2,
    question: 'In general, how satisfied are you with your relationship?',
    options: ['Not at all', 'Slightly', 'Moderately', 'Mostly', 'Completely'],
  },
  {
    id: 3,
    question: 'How good is your relationship compared to most?',
    options: ['Not at all', 'Slightly', 'Moderately', 'Mostly', 'Completely'],
  },
  {
    id: 4,
    question: 'How much do you love your partner?',
    options: ['Not at all', 'Slightly', 'Moderately', 'Mostly', 'Completely'],
  },
  {
    id: 5,
    question: 'How often do you think that things between you and your partner are going well?',
    options: ['Not at all', 'Slightly', 'Moderately', 'Mostly', 'Completely'],
  },
  {
    id: 6,
    question:
      'How effectively do you and your partner make and receive repair attempts after conflicts?',
    options: ['Not at all', 'Slightly', 'Moderately', 'Mostly', 'Completely'],
  },
  {
    id: 7,
    question: 'How well do you and your partner use compromise in your relationship?',
    options: ['Not at all', 'Slightly', 'Moderately', 'Mostly', 'Completely'],
  },
  {
    id: 8,
    question: 'Do you and your partner accept each other’s influence in decision-making?',
    options: ['Not at all', 'Slightly', 'Moderately', 'Mostly', 'Completely'],
  },
  {
    id: 9,
    question: 'Do you and your partner truly know each other’s inner worlds (Love Maps)?',
    options: ['Not at all', 'Slightly', 'Moderately', 'Mostly', 'Completely'],
  },
  {
    id: 10,
    question: 'Do you feel supported by your partner when you face personal challenges?',
    options: ['Not at all', 'Slightly', 'Moderately', 'Mostly', 'Completely'],
  },
];

const RelationshipHealthQuiz: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<string>('');

  const handleAnswer = (id: number, index: number) => {
    setAnswers((prev) => ({ ...prev, [id]: index }));
  };

  const calculateScore = (): number => {
    const vals = Object.values(answers);
    if (!vals.length) return 0;
    const total = vals.reduce((acc, v) => acc + v, 0);
    return (total / (vals.length * 4)) * 100;
  };

  async function submitQuiz(): Promise<void> {
    const score = Math.round(calculateScore());
    const assessment = quizService.getRelationshipAssessmentText(score);

    const assessmentText = assessment instanceof Promise ? await assessment : assessment;
    console.log('Assessment:', assessmentText);

    const { error } = await supabase.from('quizzes').insert({
      user_id: (await supabase.auth.getUser()).data.user?.id!,
      score,
      assessment: assessmentText,
      answers,
      // Add missing required fields based on your type definition
      quiz_type: 'relationship', // Default quiz type
    });

    if (error) {
      console.error('Insert failed:', error);
      return;
    }
    console.log(`Your relationship health is ${score}%`);
    setResult(`Your relationship health is ${score}%`);
  }

  return (
    <SafeAreaView className="flex-1 bg-white p-6">
      <ScrollView>
        <Text className="mb-4 text-2xl font-bold">Relationship Health Check</Text>
        {questions.map((q) => (
          <QuizQuestion
            key={q.id}
            questionNumber={q.id}
            question={q.question}
            options={q.options}
            selectedOption={answers[q.id] ?? -1}
            onSelect={(index) => handleAnswer(q.id, index)}
          />
        ))}

        <TouchableOpacity className="mb-4 rounded-xl bg-indigo-500 py-3" onPress={submitQuiz}>
          <Text className="text-center text-white">See Results</Text>
        </TouchableOpacity>

        {result !== '' && <Text className="text-center text-xl">{result}</Text>}
      </ScrollView>
    </SafeAreaView>
  );
};

export default RelationshipHealthQuiz;
