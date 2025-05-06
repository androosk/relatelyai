import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Appearance,
  ActivityIndicator,
} from 'react-native';
import { Bell, MessageCircle, Book, Calendar, Heart } from 'lucide-react-native';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { checkinService, Checkin } from '../services/checkinService';
import { profileService } from '../services/profileService';
import { quizService } from 'components/services/quizService';

type TabParamList = {
  Home: undefined;
  Assessment: undefined;
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

  // User data states
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [relationshipMood, setRelationshipMood] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [lastCheckIn, setLastCheckIn] = useState('');
  const [quizScore, setQuizScore] = useState(0);
  const [hasEnoughData, setHasEnoughData] = useState(false);

  useEffect(() => {
    // Set up the listener for theme changes
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDark(colorScheme === 'dark');
    });

    // Load user data
    loadUserData();

    return () => subscription.remove();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);

      const userProfile = await profileService.getProfile();
      setUserName(userProfile.first_name || userProfile.username || 'User');
      const lastQuizScore = await quizService.getLatestQuizResult();
      setQuizScore(lastQuizScore?.score || 0);

      // Get check-in history (larger limit to ensure we have enough data for calculations)
      const checkinsData = await checkinService.getCheckinHistory(100);
      console.log('Check-ins:', checkinsData);
      setCheckins(checkinsData);
      processCheckins(checkinsData);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processCheckins = (checkinsData: Checkin[]) => {
    if (!checkinsData.length) {
      setHasEnoughData(false);
      return;
    }

    // Sort by date, newest first
    const sortedCheckins = [...checkinsData].sort((a, b) => {
      return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
    });

    // Set the last check-in time
    const lastCheckinDate = new Date(sortedCheckins[0]?.created_at || '');
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastCheckinDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    setLastCheckIn(
      diffDays === 0 ? 'today' : diffDays === 1 ? 'yesterday' : `${diffDays} days ago`
    );

    const uniqueDates = new Set<string>();
    const dateOnlyCheckins: { date: string; mood: number }[] = [];

    sortedCheckins.forEach((checkin) => {
      if (checkin.created_at) {
        const dateOnly = new Date(checkin.created_at).toISOString().split('T')[0];
        if (!uniqueDates.has(dateOnly)) {
          uniqueDates.add(dateOnly);
          dateOnlyCheckins.push({
            date: dateOnly,
            mood: checkin.mood_score,
          });
        }
      }
    });

    const hasEnough = uniqueDates.size >= 5;
    setHasEnoughData(hasEnough);

    if (hasEnough) {
      const totalMood = dateOnlyCheckins.reduce((sum, item) => sum + item.mood, 0);
      const avgMood = totalMood / dateOnlyCheckins.length;
      setRelationshipMood(avgMood);

      calculateStreak(dateOnlyCheckins);
    } else {
      setRelationshipMood(0);
      setStreakDays(0);
    }
  };

  const calculateStreak = (dateCheckins: { date: string; mood: number }[]) => {
    const sortedByOldest = [...dateCheckins].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const today = new Date().toISOString().split('T')[0];

    const mostRecentDate = sortedByOldest[sortedByOldest.length - 1]?.date;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (mostRecentDate !== today && mostRecentDate !== yesterdayStr) {
      setStreakDays(0);
      return;
    }

    // Count consecutive days backwards
    let streak = 1;
    for (let i = sortedByOldest.length - 1; i > 0; i--) {
      const currentDate = new Date(sortedByOldest[i].date);
      const prevDate = new Date(sortedByOldest[i - 1].date);

      // Check if dates are consecutive
      const timeDiff = currentDate.getTime() - prevDate.getTime();
      const daysDiff = timeDiff / (1000 * 3600 * 24);

      if (Math.round(daysDiff) === 1) {
        streak++;
      } else {
        break;
      }
    }

    setStreakDays(streak);
  };

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
          <Text className="text-lg font-bold">{userName.charAt(0)}</Text>
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-blue-500">RelatelyAI</Text>

        <TouchableOpacity className="h-10 w-10 items-center justify-center">
          <Bell size={24} color={isDark ? '#A3A3A3' : '#4B5563'} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className={`mt-4 ${colors.textSecondary}`}>Loading your relationship data...</Text>
        </View>
      ) : (
        <ScrollView className="flex-1">
          <Text className={`text-2xl font-bold ${colors.textPrimary} px-4 py-3`}>Today</Text>

          {/* Relationship Mood Card */}
          <View className={`mx-4 mb-4 ${colors.cardBackground} rounded-xl p-5`}>
            <View className="flex-row items-start justify-between">
              <Text className={`${colors.textSecondary} text-lg`}>Relationship Pulse</Text>
              {/* <TouchableOpacity>
                <Text className="text-blue-500">Check In</Text>
              </TouchableOpacity> */}
              <View className="items-center">
                <Text className={`${colors.textPrimary} text-xl`}>
                  <Text className="font-bold">{streakDays}</Text> Day Streak
                </Text>
                {/* <Text className={colors.textSecondary}>Day Streak</Text> */}
              </View>
            </View>

            {hasEnoughData ? (
              <>
                <Text className={`${colors.textPrimary} my-2 text-2xl font-bold`}>
                  {getMoodText(relationshipMood)}
                </Text>

                {/* Mood indicator bar */}
                <View
                  className={`h-3 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} my-4 w-full overflow-hidden rounded-full`}>
                  <View
                    className={`h-full rounded-full ${getMoodColor(relationshipMood).replace(
                      'text-',
                      'bg-'
                    )}`}
                    style={{ width: `${relationshipMood * 20}%` }}
                  />
                </View>

                <Text className={colors.textSecondary}>
                  Last check-in: {lastCheckIn}. Keep the momentum going!
                </Text>
              </>
            ) : (
              <View className="py-4">
                <Text className={`${colors.textPrimary} mb-2 text-lg`}>
                  Not enough data to display your relationship pulse.
                </Text>
                <Text className={colors.textSecondary}>
                  Complete check-ins on at least five different days to see your relationship health
                  trends.
                </Text>
              </View>
            )}

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
                <Text className={`${colors.textPrimary} text-5xl font-bold`}>{quizScore}%</Text>
                <Text className={colors.textSecondary}>Health Score</Text>
              </View>
            </View>

            <View className="mt-2 flex-row justify-center">
              <TouchableOpacity
                className="flex justify-center rounded-full bg-blue-500 px-4 py-2"
                onPress={() => navigation.navigate('Assessment')}>
                <Text className="font-semibold text-white">Assess Your Relationship Health</Text>
              </TouchableOpacity>
            </View>
          </View>

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

          <View className={`mx-4 mb-16 ${colors.cardBackground} rounded-xl p-5`}>
            <Text className={`${colors.textSecondary} mb-4 text-lg`}>Quick Actions</Text>

            <View className="flex-row flex-wrap justify-between">
              <TouchableOpacity
                className={`${colors.actionBg} mb-3 w-[48%] items-center rounded-lg p-3`}
                onPress={() => navigation.navigate('Chat')}>
                <MessageCircle size={24} color="#3B82F6" className="mb-2" />
                <Text className={colors.textPrimary}>Talk to AI</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`${colors.actionBg} mb-3 w-[48%] items-center rounded-lg p-3`}
                onPress={() => navigation.navigate('Resources')}>
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
      )}
    </View>
  );
};

export default HomeScreen;
