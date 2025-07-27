import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GradientBackground } from 'components/ui/GradientBackground';
import { useThemedStyles } from 'hooks/useThemedStyles';
import { profileService } from 'components/services/profileService';
import { useAuth } from 'components/contexts/AuthContext';
import type { OnboardingStackParamList } from 'components/navigation/OnboardingStack';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'RelationshipStatus'>;

export default function RelationshipStatusScreen() {
  const navigation = useNavigation<NavigationProp>();
  const styles = useThemedStyles();
  const { user } = useAuth();
  const [inRelationship, setInRelationship] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (inRelationship === null) {
      Alert.alert('Please select an option', 'Let us know if you are currently in a relationship');
      return;
    }

    setLoading(true);
    try {
      if (!user) {
        throw new Error('No authenticated user');
      }

      if (inRelationship) {
        // Navigate to relationship details screen
        navigation.navigate('RelationshipDetails');
      } else {
        // Save single status and navigate to subscription
        await profileService.updateProfile({
          relationship_status: 'single',
        });
        
        // Navigate to subscription screen
        navigation.navigate('Subscription');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to save your information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const StatusOption = ({ value, label, description }: { value: boolean; label: string; description: string }) => (
    <TouchableOpacity
      onPress={() => setInRelationship(value)}
      className={`mb-4 rounded-xl p-6 ${
        inRelationship === value
          ? 'border-2 border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-900/20'
          : `border ${styles.border} ${styles.cardBackground}`
      }`}>
      <Text
        className={`text-lg font-semibold ${
          inRelationship === value ? 'text-indigo-600 dark:text-indigo-400' : styles.textPrimary
        }`}>
        {label}
      </Text>
      <Text
        className={`mt-1 text-sm ${
          inRelationship === value ? 'text-indigo-600 dark:text-indigo-400' : styles.textSecondary
        }`}>
        {description}
      </Text>
    </TouchableOpacity>
  );

  return (
    <GradientBackground>
      <View className="flex-1 px-6 pb-8 pt-24">
        <View className="mb-8">
          <Text className={`text-3xl font-bold ${styles.textPrimary}`}>
            Are you currently in a relationship?
          </Text>
          <Text className={`mt-2 text-base ${styles.textSecondary}`}>
            This helps us tailor our guidance to your situation
          </Text>
        </View>

        <View className="flex-1">
          <StatusOption
            value={true}
            label="Yes, I'm in a relationship"
            description="Get support for your current relationship"
          />
          
          <StatusOption
            value={false}
            label="No, I'm single"
            description="Prepare for future relationships or reflect on past ones"
          />
        </View>

        <TouchableOpacity
          onPress={handleContinue}
          disabled={loading || inRelationship === null}
          className={`h-14 items-center justify-center rounded-xl ${
            loading || inRelationship === null ? 'bg-gray-400' : 'bg-indigo-600'
          }`}>
          <Text className="text-lg font-semibold text-white">
            {loading ? 'Saving...' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </GradientBackground>
  );
}