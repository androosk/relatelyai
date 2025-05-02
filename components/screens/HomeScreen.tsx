import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Appearance } from 'react-native';
import { Bell, MessageCircle, Book, Calendar, Heart } from 'lucide-react-native';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type TabParamList = {
  Home: undefined;
  Quiz: undefined;
  'Check In': undefined;
  Chat: undefined;
  Resources: undefined;
};
type StackParamList = {
  Main: undefined;
  Profile: undefined;
  EditProfile: undefined;
};
type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Home'>,
  NativeStackNavigationProp<StackParamList>
>;

// Mock data
const userData = {
  name: 'Alex',
  relationshipMood: 3.8, // Scale of 1-5
  lastCheckIn: '2 days ago',
  quizScore: 74,
  streakDays: 5,
};

// Relationship tips
const relationshipTips = [
  'Schedule a weekly date night to maintain connection',
  'Practice active listening without interrupting',
  'Express appreciation for small gestures',
  "Discuss issues when you're both calm, not during arguments",
];

const HomeScreen = () => {
  const [currentTip, setCurrentTip] = useState(0);
  const [isDark, setIsDark] = useState(Appearance.getColorScheme() === 'dark');
  const navigation = useNavigation<HomeScreenNavigationProp>();

  useEffect(() => {
    // Set up the listener for theme changes
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDark(colorScheme === 'dark');
    });

    return () => subscription.remove();
  }, []);

  const updateTheme = () => {
    const colorScheme = Appearance.getColorScheme();
    setIsDark(colorScheme === 'dark');
  };
  // Theme colors
  const colors = {
    background: isDark ? 'bg-gray-900' : 'bg-white',
    cardBackground: isDark ? 'bg-gray-800' : 'bg-gray-100',
    textPrimary: isDark ? 'text-white' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-400' : 'text-gray-600',
    accent: 'text-blue-500',
    accentBg: 'bg-blue-500',
    actionBg: isDark ? 'bg-gray-700' : 'bg-gray-200',
    tipBg: isDark ? 'bg-gray-700' : 'bg-blue-50',
    border: isDark ? 'border-gray-800' : 'border-gray-300',
  };

  // Calculate mood display values
  const getMoodText = (score: number) => {
    if (score >= 4.5) return 'Excellent';
    if (score >= 3.5) return 'Good';
    if (score >= 2.5) return 'Neutral';
    if (score >= 1.5) return 'Needs Attention';
    return 'Concerning';
  };

  const getMoodColor = (score: number) => {
    if (score >= 4.5) return 'text-green-500';
    if (score >= 3.5) return 'text-blue-500';
    if (score >= 2.5) return 'text-yellow-500';
    if (score >= 1.5) return 'text-orange-500';
    return 'text-red-500';
  };

  const getNextTip = () => {
    setCurrentTip((currentTip + 1) % relationshipTips.length);
  };

  return (
    <View className={`flex-1 ${colors.background}`}>
      <View
        className={`flex-row items-center justify-between border-b px-4 pb-3 pt-16 ${colors.border}`}>
        <TouchableOpacity
          className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-300"
          onPress={() => navigation.navigate('Profile')}>
          <Text className="text-lg font-bold">{userData.name.charAt(0)}</Text>
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-blue-500">RelatelyAI</Text>

        <TouchableOpacity className="h-10 w-10 items-center justify-center">
          <Bell size={24} color={isDark ? '#A3A3A3' : '#4B5563'} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        <Text className={`text-2xl font-bold ${colors.textPrimary} px-4 py-3`}>Today</Text>

        {/* Relationship Mood Card */}
        <View className={`mx-4 mb-4 ${colors.cardBackground} rounded-xl p-5`}>
          <View className="flex-row items-start justify-between">
            <Text className={`${colors.textSecondary} text-lg`}>Relationship Pulse</Text>
            <TouchableOpacity>
              <Text className="text-blue-500">Check In</Text>
            </TouchableOpacity>
          </View>

          <Text className={`${colors.textPrimary} my-2 text-2xl font-bold`}>
            {getMoodText(userData.relationshipMood)}
          </Text>

          {/* Mood indicator bar */}
          <View
            className={`h-3 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} my-4 w-full overflow-hidden rounded-full`}>
            <View
              className={`h-full rounded-full ${getMoodColor(userData.relationshipMood).replace(
                'text-',
                'bg-'
              )}`}
              style={{ width: `${userData.relationshipMood * 20}%` }}
            />
          </View>

          <Text className={colors.textSecondary}>
            Last check-in: {userData.lastCheckIn}. Keep the momentum going!
          </Text>

          <TouchableOpacity
            className="mt-4 self-center rounded-full bg-blue-500 px-4 py-2"
            onPress={() => navigation.navigate('Check In')}>
            <Text className="font-semibold text-white">Add New Check-In</Text>
          </TouchableOpacity>
        </View>

        {/* Relationship Score Card */}
        <View className={`mx-4 mb-4 ${colors.cardBackground} rounded-xl p-5`}>
          <Text className={`${colors.textSecondary} mb-2 text-lg`}>Relationship Health</Text>

          <View className="items-center justify-center">
            <View className="mb-4 h-48 w-48 items-center justify-center rounded-full border-8 border-blue-500">
              <Text className={`${colors.textPrimary} text-5xl font-bold`}>
                {userData.quizScore}%
              </Text>
              <Text className={colors.textSecondary}>Health Score</Text>
            </View>
          </View>

          <View className="mt-2 flex-row justify-between">
            <View className="items-center">
              <Text className={`${colors.textPrimary} text-xl font-bold`}>
                {userData.streakDays}
              </Text>
              <Text className={colors.textSecondary}>Day Streak</Text>
            </View>
            <TouchableOpacity
              className="flex justify-center rounded-full bg-blue-500 px-4 py-2"
              onPress={() => navigation.navigate('Quiz')}>
              <Text className="font-semibold text-white">Take Quiz Again</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Relationship Tip Card */}
        <View className={`mx-4 mb-4 ${colors.cardBackground} rounded-xl p-5`}>
          <View className="mb-2 flex-row items-center justify-between">
            <Text className={`${colors.textSecondary} text-lg`}>Daily Relationship Tip</Text>
            <TouchableOpacity onPress={getNextTip}>
              <Text className="text-blue-500">Next Tip</Text>
            </TouchableOpacity>
          </View>

          <View className={`${colors.tipBg} rounded-lg p-4`}>
            <Text className={colors.textPrimary + ' text-lg'}>
              "{relationshipTips[currentTip]}"
            </Text>
          </View>
        </View>

        {/* Quick Actions Card */}
        <View className={`mx-4 mb-16 ${colors.cardBackground} rounded-xl p-5`}>
          <Text className={`${colors.textSecondary} mb-4 text-lg`}>Quick Actions</Text>

          <View className="flex-row flex-wrap justify-between">
            <TouchableOpacity
              className={`${colors.actionBg} mb-3 w-[48%] items-center rounded-lg p-3`}>
              <MessageCircle size={24} color="#3B82F6" className="mb-2" />
              <Text className={colors.textPrimary}>Talk to AI</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`${colors.actionBg} mb-3 w-[48%] items-center rounded-lg p-3`}>
              <Book size={24} color="#3B82F6" className="mb-2" />
              <Text className={colors.textPrimary}>Resources</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`${colors.actionBg} mb-3 w-[48%] items-center rounded-lg p-3`}>
              <Calendar size={24} color="#3B82F6" className="mb-2" />
              <Text className={colors.textPrimary}>Check-in History</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`${colors.actionBg} mb-3 w-[48%] items-center rounded-lg p-3`}>
              <Heart size={24} color="#3B82F6" className="mb-2" />
              <Text className={colors.textPrimary}>Relationship Goals</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
