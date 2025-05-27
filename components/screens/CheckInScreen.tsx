import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmotionSelector from '../ui/EmotionSelector';
import { checkinService } from 'components/services/checkinService';

export default function CheckInScreen() {
  const [checkIns, setCheckIns] = useState<any[]>([]);
  const [currentEmotion, setCurrentEmotion] = useState(2);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCheckIns();
  }, []);

  const loadCheckIns = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await checkinService.getCheckinHistory();
      setCheckIns(data);
    } catch (err) {
      console.error('Failed to load check-ins:', err);
      setError('Failed to load check-ins. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveCheckIn = async () => {
    if (saving) return;

    try {
      setSaving(true);
      setError(null);

      await checkinService.createCheckin(currentEmotion, notes.trim(), []);

      setNotes('');
      await loadCheckIns();
    } catch (err) {
      console.error('Failed to save check-in:', err);
      setError('Failed to save check-in. Please try again.');
    } finally {
      setSaving(false);
    }
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

  const handleDeleteCheckin = async (id: string) => {
    try {
      await checkinService.deleteCheckin(id);
      setCheckIns(checkIns.filter((checkin) => checkin.id !== id));
    } catch (err) {
      console.error('Failed to delete check-in:', err);
      setError('Failed to delete check-in. Please try again.');
    }
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
        {loading && (
          <View className="items-center py-8">
            <ActivityIndicator size="large" color="#6366f1" />
            <Text className="mt-2 text-gray-500">Loading check-ins...</Text>
          </View>
        )}

        {checkIns.length > 0 &&
          !loading &&
          checkIns.map((checkIn) => (
            <View key={checkIn.id} className="mb-4 rounded-lg bg-white p-4 shadow">
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-gray-500">{formatDate(checkIn.created_at)}</Text>
                <View className="rounded-full bg-indigo-100 px-3 py-1">
                  <Text className="font-medium text-indigo-700">
                    {getEmotionText(checkIn.mood_score)}
                  </Text>
                </View>
              </View>
              {checkIn.notes ? (
                <Text className="text-gray-700">{checkIn.notes}</Text>
              ) : (
                <Text className="italic text-gray-400">No notes</Text>
              )}
              <TouchableOpacity
                className="mt-3 self-end"
                onPress={() => handleDeleteCheckin(checkIn.id)}>
                <Text className="text-sm text-red-500">Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
        {error && !loading && (
          <View className="mb-4 rounded-lg bg-red-100 p-3">
            <Text className="text-red-700">{error}</Text>
          </View>
        )}
        {checkIns.length == 0 && !loading && (
          <View className="items-center rounded-lg bg-white p-8 shadow">
            <Text className="text-center text-gray-500">
              No check-ins yet. Start tracking your relationship mood today!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
