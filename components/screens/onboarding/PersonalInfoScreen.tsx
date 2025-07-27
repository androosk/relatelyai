import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { GradientBackground } from 'components/ui/GradientBackground';
import { useThemedStyles } from 'hooks/useThemedStyles';
import { profileService } from 'components/services/profileService';
import { useAuth } from 'components/contexts/AuthContext';
import type { OnboardingStackParamList } from 'components/navigation/OnboardingStack';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'PersonalInfo'>;

type Gender = 'female' | 'male' | 'non-binary';

export default function PersonalInfoScreen() {
  const navigation = useNavigation<NavigationProp>();
  const styles = useThemedStyles();
  const { user } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [birthday, setBirthday] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState<Gender | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const validateAndSave = async () => {
    if (!firstName.trim()) {
      Alert.alert('Required Field', 'Please enter your first name');
      return;
    }

    if (!gender) {
      Alert.alert('Required Field', 'Please select your gender');
      return;
    }

    const age = calculateAge(birthday);
    if (age < 18) {
      Alert.alert('Age Requirement', 'You must be 18 or older to use this app');
      return;
    }

    setLoading(true);
    try {
      if (!user) {
        throw new Error('No authenticated user');
      }

      await profileService.updateProfile({
        first_name: firstName.trim(),
        age: age,
      });

      // Navigate to relationship status screen
      navigation.navigate('RelationshipStatus');
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
      setBirthday(selectedDate);
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const GenderButton = ({ value, label }: { value: Gender; label: string }) => (
    <TouchableOpacity
      onPress={() => setGender(value)}
      className={`flex-1 rounded-xl p-4 ${
        gender === value
          ? 'border-2 border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-900/20'
          : `border ${styles.border} ${styles.cardBackground}`
      }`}>
      <Text
        className={`text-center text-base font-medium ${
          gender === value ? 'text-indigo-600 dark:text-indigo-400' : styles.textPrimary
        }`}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View className="flex-1 px-6 pb-8 pt-24">
            <View className="mb-8">
              <Text className={`text-3xl font-bold ${styles.textPrimary}`}>
                Let's get to know you
              </Text>
              <Text className={`mt-2 text-base ${styles.textSecondary}`}>
                This helps us personalize your experience
              </Text>
            </View>

            <View className="mb-6">
              <Text className={`mb-2 text-base font-medium ${styles.textPrimary}`}>First Name</Text>
              <TextInput
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter your first name"
                placeholderTextColor={styles.textSecondary}
                className={`h-14 rounded-xl px-4 text-base ${styles.border} border ${styles.cardBackground} ${styles.inputText}`}
              />
            </View>

            <View className="mb-6">
              <Text className={`mb-2 text-base font-medium ${styles.textPrimary}`}>Birthday</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className={`h-14 justify-center rounded-xl px-4 ${styles.border} border ${styles.cardBackground}`}>
                <Text className={`text-base ${birthday ? styles.inputText : styles.textSecondary}`}>
                  {formatDate(birthday)}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={birthday}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>

            <View className="mb-8">
              <Text className={`mb-3 text-base font-medium ${styles.textPrimary}`}>Gender</Text>
              <View className="flex-row gap-3">
                <GenderButton value="female" label="Female" />
                <GenderButton value="male" label="Male" />
              </View>
              <View className="mt-3">
                <GenderButton value="non-binary" label="Non-binary" />
              </View>
            </View>

            <View className="flex-1" />

            <TouchableOpacity
              onPress={validateAndSave}
              disabled={loading}
              className={`mb-4 h-14 items-center justify-center rounded-xl ${
                loading ? 'bg-gray-400' : 'bg-indigo-600'
              }`}>
              <Text className="text-lg font-semibold text-white">
                {loading ? 'Saving...' : 'Continue'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}
