import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';

interface EmotionSelectorProps {
  selectedEmotion: number;
  onSelectEmotion: (index: number) => void;
}
type Emotion = {
  icon: string;
  label: string;
  color: string;
  library: 'FontAwesome5' | 'FontAwesome6';
};

const iconLibraries = {
  FontAwesome5,
  FontAwesome6,
} as const;

export default function EmotionSelector({
  selectedEmotion,
  onSelectEmotion,
}: EmotionSelectorProps) {
  const emotions: Emotion[] = [
    { icon: 'sad-tear', label: 'Very Sad', color: '#ef4444', library: 'FontAwesome5' },
    { icon: 'face-frown', label: 'Sad', color: '#f97316', library: 'FontAwesome6' },
    { icon: 'meh', label: 'Neutral', color: '#eab308', library: 'FontAwesome5' },
    { icon: 'smile', label: 'Happy', color: '#22c55e', library: 'FontAwesome5' },
    { icon: 'grin-hearts', label: 'Very Happy', color: '#3b82f6', library: 'FontAwesome5' },
  ];

  return (
    <View className="flex-row justify-between">
      {emotions.map((emotion, index) => {
        const IconComponent = iconLibraries[emotion.library as keyof typeof iconLibraries];

        return (
          <TouchableOpacity
            key={index}
            className={`items-center p-2 ${selectedEmotion === index ? 'rounded-lg bg-gray-100' : ''}`}
            onPress={() => onSelectEmotion(index)}>
            <IconComponent
              name={emotion.icon as any}
              size={32}
              color={selectedEmotion === index ? emotion.color : '#9ca3af'}
            />
            <Text
              className={`mt-1 text-xs ${selectedEmotion === index ? 'font-bold' : 'text-gray-500'}`}>
              {emotion.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
