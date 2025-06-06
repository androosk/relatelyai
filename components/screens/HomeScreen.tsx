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
import { useTheme } from 'components/contexts/ThemeContext';
import { GradientBackground } from 'components/ui/GradientBackground';

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

const relationshipTips = [
  'Schedule a weekly date night to maintain connection',
  'Practice active listening without interrupting',
  'Express appreciation for small gestures',
  "Discuss issues when you're both calm, not during arguments",
];

const HomeScreen = () => {
  const [currentTip, setCurrentTip] = useState(0);
  const { isDarkMode } = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [relationshipMood, setRelationshipMood] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [lastCheckIn, setLastCheckIn] = useState('');
  const [quizScore, setQuizScore] = useState(0);
  const [hasEnoughData, setHasEnoughData] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);

      const userProfile = await profileService.getProfile();
      setUserName(userProfile.first_name || userProfile.username || 'User');
      const lastQuizScore = await quizService.getLatestQuizResult();
      setQuizScore(lastQuizScore?.score || 0);

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

    const sortedCheckins = [...checkinsData].sort((a, b) => {
      return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
    });

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

    let streak = 1;
    for (let i = sortedByOldest.length - 1; i > 0; i--) {
      const currentDate = new Date(sortedByOldest[i].date);
      const prevDate = new Date(sortedByOldest[i - 1].date);
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

  const getThemedStyles = () => ({
    cardBackground: isDarkMode ? 'bg-charcoal/80' : 'bg-white/80',
    textPrimary: isDarkMode ? 'text-soft-gray' : 'text-charcoal',
    textSecondary: isDarkMode ? 'text-mauve-mist' : 'text-charcoal/70',
    accent: 'text-deep-plum',
    accentBg: 'bg-deep-plum',
    actionBg: isDarkMode ? 'bg-charcoal/60' : 'bg-soft-gray/80',
    tipBg: isDarkMode ? 'bg-mauve-mist/20' : 'bg-peach-sorbet/50',
    border: isDarkMode ? 'border-charcoal/50' : 'border-mauve-mist/30',
  });

  const styles = getThemedStyles();

  const getMoodText = (score: number) => {
    console.log('Calculating mood text for score:', score);
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
    <GradientBackground>
      <View className="flex-1">
        {/* Header */}
        <View
          className={`flex-row items-center justify-between border-b px-4 pb-3 pt-16 ${styles.border}`}>
          <TouchableOpacity
            className="bg-deep-plum flex h-10 w-10 items-center justify-center rounded-full"
            onPress={() => navigation.navigate('Profile')}>
            <Text className="text-lg font-bold text-white">{userName.charAt(0)}</Text>
          </TouchableOpacity>

          <Text className={`text-2xl font-bold ${styles.accent}`}>RelatelyAI</Text>

          <TouchableOpacity className="h-10 w-10 items-center justify-center">
            <Bell size={24} color={isDarkMode ? '#C8A4B7' : '#7F4B6E'} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#7F4B6E" />
            <Text className={`mt-4 ${styles.textSecondary}`}>
              Loading your relationship data...
            </Text>
          </View>
        ) : (
          <ScrollView className="flex-1">
            <Text className={`text-2xl font-bold ${styles.textPrimary} px-4 py-3`}>Today</Text>

            {/* Relationship Pulse Card */}
            <View className={`mx-4 mb-4 ${styles.cardBackground} rounded-xl p-5`}>
              <View className="flex-row items-start justify-between">
                <Text className={`${styles.textSecondary} text-lg`}>Relationship Pulse</Text>
                <View className="items-center">
                  <Text className={`${styles.textPrimary} text-xl`}>
                    <Text className="font-bold">{streakDays}</Text> Day Streak
                  </Text>
                </View>
              </View>

              {hasEnoughData ? (
                <>
                  <Text className={`${styles.textPrimary} my-2 text-2xl font-bold`}>
                    {getMoodText(relationshipMood)}
                  </Text>
                  <View className={`bg-mauve-mist/30 my-4 h-3 w-full overflow-hidden rounded-full`}>
                    <View
                      className={`h-full rounded-full ${getMoodColor(relationshipMood).replace('text-', 'bg-')}`}
                      style={{ width: `${relationshipMood * 20}%` }}
                    />
                  </View>
                  <Text className={styles.textSecondary}>
                    Last check-in: {lastCheckIn}. Keep the momentum going!
                  </Text>
                </>
              ) : (
                <View className="py-4">
                  <Text className={`${styles.textPrimary} mb-2 text-lg`}>
                    Not enough data to display your relationship pulse.
                  </Text>
                  <Text className={styles.textSecondary}>
                    Complete check-ins on at least five different days to see your relationship
                    health trends.
                  </Text>
                </View>
              )}

              <TouchableOpacity
                className={`mt-4 self-center rounded-full ${styles.accentBg} px-4 py-2`}
                onPress={() => navigation.navigate('Check In')}>
                <Text className="font-semibold text-white">Add New Check-In</Text>
              </TouchableOpacity>
            </View>

            {/* Relationship Health Card */}
            <View className={`mx-4 mb-4 ${styles.cardBackground} rounded-xl p-5`}>
              <Text className={`${styles.textSecondary} mb-2 text-lg`}>Relationship Health</Text>

              <View className="items-center justify-center">
                <View
                  className={`border-deep-plum mb-4 h-48 w-48 items-center justify-center rounded-full border-8`}>
                  <Text className={`${styles.textPrimary} text-5xl font-bold`}>{quizScore}%</Text>
                  <Text className={styles.textSecondary}>Health Score</Text>
                </View>
              </View>

              <View className="mt-2 flex-row justify-center">
                <TouchableOpacity
                  className={`flex justify-center rounded-full ${styles.accentBg} px-4 py-2`}
                  onPress={() => navigation.navigate('Assessment')}>
                  <Text className="font-semibold text-white">Assess Your Relationship Health</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Daily Tip Card */}
            <View className={`mx-4 mb-4 ${styles.cardBackground} rounded-xl p-5`}>
              <View className="mb-2 flex-row items-center justify-between">
                <Text className={`${styles.textSecondary} text-lg`}>Daily Relationship Tip</Text>
                <TouchableOpacity onPress={getNextTip}>
                  <Text className={styles.accent}>Next Tip</Text>
                </TouchableOpacity>
              </View>

              <View className={`${styles.tipBg} rounded-lg p-4`}>
                <Text className={`${styles.textPrimary} text-lg`}>
                  "{relationshipTips[currentTip]}"
                </Text>
              </View>
            </View>

            {/* Quick Actions Card */}
            <View className={`mx-4 mb-16 ${styles.cardBackground} rounded-xl p-5`}>
              <Text className={`${styles.textSecondary} mb-4 text-lg`}>Quick Actions</Text>

              <View className="flex-row flex-wrap justify-between">
                <TouchableOpacity
                  className={`${styles.actionBg} mb-3 w-[48%] items-center rounded-lg p-3`}
                  onPress={() => navigation.navigate('Chat')}>
                  <MessageCircle size={24} color="#7F4B6E" className="mb-2" />
                  <Text className={styles.textPrimary}>Talk to AI</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`${styles.actionBg} mb-3 w-[48%] items-center rounded-lg p-3`}
                  onPress={() => navigation.navigate('Resources')}>
                  <Book size={24} color="#7F4B6E" className="mb-2" />
                  <Text className={styles.textPrimary}>Resources</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`${styles.actionBg} mb-3 w-[48%] items-center rounded-lg p-3`}>
                  <Calendar size={24} color="#7F4B6E" className="mb-2" />
                  <Text className={styles.textPrimary}>Check-in History</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`${styles.actionBg} mb-3 w-[48%] items-center rounded-lg p-3`}>
                  <Heart size={24} color="#7F4B6E" className="mb-2" />
                  <Text className={styles.textPrimary}>Relationship Goals</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </GradientBackground>
  );
};

export default HomeScreen;
