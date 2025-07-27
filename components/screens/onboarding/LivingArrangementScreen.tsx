import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GradientBackground } from 'components/ui/GradientBackground';
import { useThemedStyles } from 'hooks/useThemedStyles';
import { profileService } from 'components/services/profileService';
import { useAuth } from 'components/contexts/AuthContext';
import { FontAwesome5 } from '@expo/vector-icons';
import type { OnboardingStackParamList } from 'components/navigation/OnboardingStack';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'LivingArrangement'>;

type LivingArrangement = 'together' | 'separately_nearby' | 'separately_long_distance';

interface ArrangementOption {
  value: LivingArrangement;
  label: string;
  description: string;
  icon: string;
}

const ARRANGEMENT_OPTIONS: ArrangementOption[] = [
  {
    value: 'together',
    label: 'Together',
    description: 'We live in the same home',
    icon: 'home',
  },
  {
    value: 'separately_nearby',
    label: 'Separately Nearby',
    description: 'We live in the same area',
    icon: 'map-marker-alt',
  },
  {
    value: 'separately_long_distance',
    label: 'Separately Long Distance',
    description: 'We live far from each other',
    icon: 'globe-americas',
  },
];

export default function LivingArrangementScreen() {
  const navigation = useNavigation<NavigationProp>();
  const styles = useThemedStyles();
  const { user } = useAuth();
  const [arrangement, setArrangement] = useState<LivingArrangement | null>(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!arrangement) {
      Alert.alert('Please select an option', 'Let us know about your living arrangement');
      return;
    }

    setLoading(true);
    try {
      if (!user) {
        throw new Error('No authenticated user');
      }

      await profileService.updateProfile({
        relationship_goals: {
          living_arrangement: arrangement,
        },
      });

      // Navigate to subscription screen
      navigation.navigate('Subscription');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to save your information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const ArrangementOption = ({ option }: { option: ArrangementOption }) => (
    <TouchableOpacity
      onPress={() => setArrangement(option.value)}
      className={`mb-4 flex-row items-center rounded-xl p-5 ${
        arrangement === option.value
          ? 'border-2 border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-900/20'
          : `border ${styles.border} ${styles.cardBackground}`
      }`}>
      <View
        className={`mr-4 h-12 w-12 items-center justify-center rounded-full ${
          arrangement === option.value
            ? 'bg-indigo-100 dark:bg-indigo-800/30'
            : 'bg-gray-100 dark:bg-gray-800/30'
        }`}>
        <FontAwesome5
          name={option.icon}
          size={20}
          color={arrangement === option.value ? '#6366f1' : '#6b7280'}
        />
      </View>
      <View className="flex-1">
        <Text
          className={`text-lg font-semibold ${
            arrangement === option.value ? 'text-indigo-600 dark:text-indigo-400' : styles.textPrimary
          }`}>
          {option.label}
        </Text>
        <Text
          className={`mt-0.5 text-sm ${
            arrangement === option.value ? 'text-indigo-600 dark:text-indigo-400' : styles.textSecondary
          }`}>
          {option.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <GradientBackground>
      <View className="flex-1 px-6 pb-8 pt-24">
        <View className="mb-8">
          <Text className={`text-3xl font-bold ${styles.textPrimary}`}>
            Do you live together?
          </Text>
          <Text className={`mt-2 text-base ${styles.textSecondary}`}>
            Understanding your living situation helps us provide better advice
          </Text>
        </View>

        <View className="flex-1">
          {ARRANGEMENT_OPTIONS.map((option) => (
            <ArrangementOption key={option.value} option={option} />
          ))}
        </View>

        <TouchableOpacity
          onPress={handleContinue}
          disabled={loading || !arrangement}
          className={`h-14 items-center justify-center rounded-xl ${
            loading || !arrangement ? 'bg-gray-400' : 'bg-indigo-600'
          }`}>
          <Text className="text-lg font-semibold text-white">
            {loading ? 'Saving...' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </GradientBackground>
  );
}