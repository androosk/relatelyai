import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GradientBackground } from 'components/ui/GradientBackground';
import { useThemedStyles } from 'hooks/useThemedStyles';
import { profileService } from 'components/services/profileService';
import { useAuth } from 'components/contexts/AuthContext';
import type { OnboardingStackParamList } from 'components/navigation/OnboardingStack';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'RelationshipDetails'>;

type RelationshipType = 'dating' | 'in_a_relationship' | 'engaged' | 'married' | 'civil_partnership' | 'other';

const RELATIONSHIP_TYPES: { value: RelationshipType; label: string }[] = [
  { value: 'dating', label: 'Dating' },
  { value: 'in_a_relationship', label: 'In a relationship' },
  { value: 'engaged', label: 'Engaged' },
  { value: 'married', label: 'Married' },
  { value: 'civil_partnership', label: 'Civil partnership' },
  { value: 'other', label: 'Other' },
];

const DURATION_OPTIONS = [
  { value: '0-1', label: 'Less than 1 year' },
  { value: '1-5', label: '1-5 years' },
  { value: '5-10', label: '5-10 years' },
  { value: '10+', label: 'More than 10 years' },
];

export default function RelationshipDetailsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const styles = useThemedStyles();
  const { user } = useAuth();
  const [duration, setDuration] = useState<string>('');
  const [relationshipType, setRelationshipType] = useState<RelationshipType | null>(null);
  const [anniversary, setAnniversary] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!duration) {
      Alert.alert('Required Field', 'Please select how long you\'ve been together');
      return;
    }

    if (!relationshipType) {
      Alert.alert('Required Field', 'Please select your relationship status');
      return;
    }

    setLoading(true);
    try {
      if (!user) {
        throw new Error('No authenticated user');
      }

      // Calculate approximate relationship start date based on duration or anniversary
      let startDate = new Date();
      
      if (anniversary) {
        // Use the anniversary date as relationship start
        startDate = anniversary;
      } else {
        // Calculate based on duration
        const today = new Date();
        switch (duration) {
          case '0-1':
            startDate.setMonth(today.getMonth() - 6);
            break;
          case '1-5':
            startDate.setFullYear(today.getFullYear() - 3);
            break;
          case '5-10':
            startDate.setFullYear(today.getFullYear() - 7);
            break;
          case '10+':
            startDate.setFullYear(today.getFullYear() - 12);
            break;
        }
      }

      await profileService.updateProfile({
        relationship_status: relationshipType,
        relationship_start_date: startDate.toISOString(),
        anniversary_date: anniversary ? anniversary.toISOString() : undefined,
      });

      // Navigate to partner info screen
      navigation.navigate('PartnerInfo');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to save your information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentMode = event.type;
    setShowDatePicker(Platform.OS === 'ios');
    
    // Only set the date if user pressed "OK" (not "Cancel")
    if (currentMode === 'set' && selectedDate) {
      setAnniversary(selectedDate);
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const DurationButton = ({ value, label }: { value: string; label: string }) => (
    <TouchableOpacity
      onPress={() => setDuration(value)}
      className={`mb-3 rounded-xl p-4 ${
        duration === value
          ? 'border-2 border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-900/20'
          : `border ${styles.border} ${styles.cardBackground}`
      }`}>
      <Text
        className={`text-center text-base font-medium ${
          duration === value ? 'text-indigo-600 dark:text-indigo-400' : styles.textPrimary
        }`}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const TypeButton = ({ value, label }: { value: RelationshipType; label: string }) => (
    <TouchableOpacity
      onPress={() => setRelationshipType(value)}
      className={`mb-3 rounded-xl p-4 ${
        relationshipType === value
          ? 'border-2 border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-900/20'
          : `border ${styles.border} ${styles.cardBackground}`
      }`}>
      <Text
        className={`text-center text-base font-medium ${
          relationshipType === value ? 'text-indigo-600 dark:text-indigo-400' : styles.textPrimary
        }`}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <GradientBackground>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-6 pb-8 pt-24">
          <View className="mb-8">
            <Text className={`text-3xl font-bold ${styles.textPrimary}`}>
              Tell us about your relationship
            </Text>
            <Text className={`mt-2 text-base ${styles.textSecondary}`}>
              This helps us provide more relevant support
            </Text>
          </View>

          <View className="mb-8">
            <Text className={`mb-4 text-lg font-semibold ${styles.textPrimary}`}>
              How long have you been together?
            </Text>
            <View className="flex-row flex-wrap justify-between">
              {DURATION_OPTIONS.map((option) => (
                <View key={option.value} className="mb-3 w-[48%]">
                  <DurationButton value={option.value} label={option.label} />
                </View>
              ))}
            </View>
          </View>

          <View className="mb-8">
            <Text className={`mb-2 text-base font-medium ${styles.textPrimary}`}>
              Anniversary Date (Optional)
            </Text>
            <Text className={`mb-3 text-sm ${styles.textSecondary}`}>
              Remember your special day for future celebrations
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className={`h-14 justify-center rounded-xl px-4 ${styles.border} border ${styles.cardBackground}`}>
              <Text className={`text-base ${anniversary ? styles.inputText : styles.textSecondary}`}>
                {anniversary ? formatDate(anniversary) : 'Select your anniversary date'}
              </Text>
            </TouchableOpacity>
            
            {showDatePicker && (
              <DateTimePicker
                value={anniversary || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>

          <View className="mb-8">
            <Text className={`mb-4 text-lg font-semibold ${styles.textPrimary}`}>
              How do you define your relationship?
            </Text>
            <View className="flex-row flex-wrap justify-between">
              {RELATIONSHIP_TYPES.map((type) => (
                <View key={type.value} className="mb-3 w-[48%]">
                  <TypeButton value={type.value} label={type.label} />
                </View>
              ))}
            </View>
          </View>

          <View className="flex-1" />

          <TouchableOpacity
            onPress={handleContinue}
            disabled={loading || !duration || !relationshipType}
            className={`h-14 items-center justify-center rounded-xl ${
              loading || !duration || !relationshipType ? 'bg-gray-400' : 'bg-indigo-600'
            }`}>
            <Text className="text-lg font-semibold text-white">
              {loading ? 'Saving...' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}