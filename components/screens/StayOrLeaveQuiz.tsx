import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QuizQuestion from 'components/ui/QuizQuestion';
import { supabase } from 'api/supabase';
import { quizService, Question } from 'components/services/quizService';

const questions: Question[] = [
  {
    id: 1,
    question: 'I feel emotionally fulfilled in my relationship.',
    options: ['Not at all', 'Slightly', 'Moderately', 'Mostly', 'Completely'],
  },
  {
    id: 2,
    question: 'My partner truly understands my inner thoughts and feelings.',
    options: ['Not at all', 'Slightly', 'Moderately', 'Mostly', 'Completely'],
  },
  {
    id: 3,
    question: 'My partner treats me with genuine respect at all times.',
    options: ['Not at all', 'Slightly', 'Moderately', 'Mostly', 'Completely'],
  },
  {
    id: 4,
    question: 'I feel admired and appreciated by my partner.',
    options: ['Not at all', 'Slightly', 'Moderately', 'Mostly', 'Completely'],
  },
  {
    id: 5,
    question: 'We have open and honest conversations regularly.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
  },
  {
    id: 6,
    question: 'My partner listens attentively when I share my concerns.',
    options: ['Not at all', 'Slightly', 'Moderately', 'Mostly', 'Completely'],
  },
  {
    id: 7,
    question: 'I trust my partner completely to be honest and faithful.',
    options: ['Not at all', 'Slightly', 'Moderately', 'Mostly', 'Completely'],
  },
  {
    id: 8,
    question: 'I feel safe sharing my vulnerabilities with my partner.',
    options: ['Not at all', 'Slightly', 'Moderately', 'Mostly', 'Completely'],
  },
  {
    id: 9,
    question: 'We share similar life values and long-term goals.',
    options: ['Not at all', 'Slightly', 'Moderately', 'Mostly', 'Completely'],
  },
  {
    id: 10,
    question: 'We frequently discuss and plan for our future together.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
  },
  {
    id: 11,
    question: 'Our relationship allows me to grow as an individual.',
    options: ['Not at all', 'Slightly', 'Moderately', 'Mostly', 'Completely'],
  },
  {
    id: 12,
    question: 'My partner supports my personal dreams and aspirations.',
    options: ['Not at all', 'Slightly', 'Moderately', 'Mostly', 'Completely'],
  },
  {
    id: 13,
    question: 'We manage disagreements calmly and constructively.',
    options: ['Not at all', 'Slightly', 'Moderately', 'Mostly', 'Completely'],
  },
  {
    id: 14,
    question: 'After conflicts, we repair and reconnect effectively.',
    options: ['Not at all', 'Slightly', 'Moderately', 'Mostly', 'Completely'],
  },
  {
    id: 15,
    question: 'I generally assume my partner has positive intentions.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
  },
  {
    id: 16,
    question: 'My partner responds positively when I reach out for support.',
    options: ['Not at all', 'Slightly', 'Moderately', 'Mostly', 'Completely'],
  },
  {
    id: 17,
    question: 'We have shared rituals or traditions that strengthen our bond.',
    options: ['Not at all', 'Slightly', 'Moderately', 'Mostly', 'Completely'],
  },
  {
    id: 18,
    question: 'Our relationship has a clear sense of purpose and shared meaning.',
    options: ['Not at all', 'Slightly', 'Moderately', 'Mostly', 'Completely'],
  },
  {
    id: 19,
    question: 'I often think about ending this relationship.',
    options: ['Not at all', 'Slightly', 'Moderately', 'Mostly', 'Completely'],
  },
  {
    id: 20,
    question: 'I feel supported by my partner when I’m under stress.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
  },
];

const StayOrLeaveQuiz: React.FC = () => {
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
    const assessmentText = await quizService.getStayOrLeaveAssessmentText(score);

    console.log('Assessment:', assessmentText);

    const { error } = await supabase.from('quizzes').insert({
      user_id: (await supabase.auth.getUser()).data.user?.id!,
      score,
      assessment: assessmentText,
      answers,
      quiz_type: 'stayorleave',
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
        <Text className="mb-4 text-2xl font-bold">Should I Stay or Leave?</Text>
        {questions.map((q) => (
          <QuizQuestion
            questionNumber={q.id}
            key={q.id}
            question={q.question}
            options={q.options}
            selectedOption={answers[q.id] ?? -1}
            onSelect={(index) => handleAnswer(q.id, index)}
          />
        ))}

        <TouchableOpacity className="mb-4 rounded-xl bg-pink-500 py-3" onPress={submitQuiz}>
          <Text className="text-center text-white">See Results</Text>
        </TouchableOpacity>

        {result !== '' && <Text className="text-center text-lg">{result}</Text>}
      </ScrollView>
    </SafeAreaView>
  );
};

export default StayOrLeaveQuiz;
