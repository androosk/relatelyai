import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GradientBackground } from 'components/ui/GradientBackground';
import { useThemedStyles } from 'hooks/useThemedStyles';
import { profileService } from 'components/services/profileService';
import { useAuth } from 'components/contexts/AuthContext';
import { FontAwesome5 } from '@expo/vector-icons';
import type { OnboardingStackParamList } from 'components/navigation/OnboardingStack';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'PartnerInfo'>;

export default function PartnerInfoScreen() {
  const navigation = useNavigation<NavigationProp>();
  const styles = useThemedStyles();
  const { user } = useAuth();
  const [partnerName, setPartnerName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!partnerName.trim()) {
      Alert.alert('Required Field', 'Please enter your partner\'s name');
      return;
    }

    setLoading(true);
    try {
      if (!user) {
        throw new Error('No authenticated user');
      }

      await profileService.updateProfile({
        partner_name: partnerName.trim(),
      });

      // Navigate to living arrangement screen
      navigation.navigate('LivingArrangement');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to save your information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigation.navigate('LivingArrangement');
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <View className="flex-1 px-6 pb-8 pt-24">
          <View className="mb-8">
            <Text className={`text-3xl font-bold ${styles.textPrimary}`}>
              What's your partner's name?
            </Text>
            <Text className={`mt-2 text-base ${styles.textSecondary}`}>
              This helps personalize your experience
            </Text>
          </View>

          <View className="mb-8">
            <View className={`mb-6 flex-row items-center rounded-xl p-4 ${styles.cardBackground}`}>
              <FontAwesome5 
                name="heart" 
                size={24} 
                color="#ec4899" 
                style={{ marginRight: 16 }}
              />
              <View className="flex-1">
                <Text className={`text-sm ${styles.textSecondary}`}>
                  We'll use this to personalize advice and insights
                </Text>
              </View>
            </View>

            <View>
              <Text className={`mb-2 text-base font-medium ${styles.textPrimary}`}>
                Partner's First Name
              </Text>
              <TextInput
                value={partnerName}
                onChangeText={setPartnerName}
                placeholder="Enter their first name"
                placeholderTextColor={styles.textSecondary}
                autoCapitalize="words"
                className={`h-14 rounded-xl px-4 text-base ${styles.border} border ${styles.cardBackground} ${styles.inputText}`}
              />
            </View>
          </View>

          <View className="flex-1" />

          <TouchableOpacity
            onPress={handleContinue}
            disabled={loading}
            className={`mb-4 h-14 items-center justify-center rounded-xl ${
              loading ? 'bg-gray-400' : 'bg-indigo-600'
            }`}>
            <Text className="text-lg font-semibold text-white">
              {loading ? 'Saving...' : 'Continue'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSkip} className="py-2">
            <Text className={`text-center text-sm ${styles.textSecondary}`}>
              Skip for now
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}