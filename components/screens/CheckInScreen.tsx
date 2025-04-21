import { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmotionSelector from '../ui/EmotionSelector';

// In a real app, you'd use Supabase to save/retrieve these
const mockCheckIns = [
  { id: 1, date: '2025-04-18', emotion: 4, notes: 'Had a great conversation about our future' },
  { id: 2, date: '2025-04-15', emotion: 2, notes: 'We argued about finances again' },
  { id: 3, date: '2025-04-10', emotion: 3, notes: 'Normal day, nothing special' },
];

export default function CheckInScreen() {
  const [checkIns, setCheckIns] = useState(mockCheckIns);
  const [currentEmotion, setCurrentEmotion] = useState(3); // Middle emotion
  const [notes, setNotes] = useState('');

  const saveCheckIn = () => {
    const today = new Date().toISOString().split('T')[0];
    const newCheckIn = {
      id: Date.now(),
      date: today,
      emotion: currentEmotion,
      notes: notes.trim(),
    };

    setCheckIns([newCheckIn, ...checkIns]);
    setNotes('');

    // In a real app, save to Supabase here
    // supabase.from('checkins').insert([newCheckIn])
  };

  const getEmotionText = (emotion: number) => {
    const emotions = ['Very Sad', 'Sad', 'Neutral', 'Happy', 'Very Happy'];
    return emotions[emotion];
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-4">
        <Text className="mb-6 text-2xl font-bold text-indigo-600">Relationship Check-In</Text>

        <View className="mb-6 rounded-lg bg-white p-6 shadow">
          <Text className="mb-4 text-lg font-medium">
            How are you feeling about your relationship today?
          </Text>

          <EmotionSelector selectedEmotion={currentEmotion} onSelectEmotion={setCurrentEmotion} />

          <Text className="mb-2 mt-6 text-base font-medium">Notes</Text>
          <TextInput
            className="min-h-16 rounded-lg border border-gray-300 p-3 text-base"
            multiline
            placeholder="Add any thoughts about your relationship today..."
            value={notes}
            onChangeText={setNotes}
          />

          <TouchableOpacity
            className="mt-6 rounded-lg bg-indigo-600 px-6 py-3"
            onPress={saveCheckIn}>
            <Text className="text-center font-semibold text-white">Save Check-In</Text>
          </TouchableOpacity>
        </View>

        <Text className="mb-4 text-xl font-semibold">Previous Check-Ins</Text>

        {checkIns.map((checkIn) => (
          <View key={checkIn.id} className="mb-4 rounded-lg bg-white p-4 shadow">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-gray-500">{formatDate(checkIn.date)}</Text>
              <View className="rounded-full bg-indigo-100 px-3 py-1">
                <Text className="font-medium text-indigo-700">
                  {getEmotionText(checkIn.emotion)}
                </Text>
              </View>
            </View>
            {checkIn.notes ? (
              <Text className="text-gray-700">{checkIn.notes}</Text>
            ) : (
              <Text className="italic text-gray-400">No notes</Text>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
