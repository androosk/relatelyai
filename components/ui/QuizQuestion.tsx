import { View, Text, TouchableOpacity } from 'react-native';

interface QuizQuestionProps {
  question: string;
  options: string[];
  selectedOption: number;
  onSelect: (index: number) => void;
}

export default function QuizQuestion({
  question,
  options,
  selectedOption,
  onSelect,
}: QuizQuestionProps) {
  return (
    <View className="mb-6 rounded-lg bg-white p-4 shadow">
      <Text className="mb-3 text-lg font-semibold">{question}</Text>

      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          className={`mb-2 rounded-lg border p-3 ${
            selectedOption === index ? 'border-indigo-500 bg-indigo-100' : 'border-gray-300'
          }`}
          onPress={() => onSelect(index)}>
          <Text
            className={`${selectedOption === index ? 'font-medium text-indigo-700' : 'text-gray-700'}`}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
