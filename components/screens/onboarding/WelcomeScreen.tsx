import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GradientBackground } from 'components/ui/GradientBackground';
import { useThemedStyles } from 'hooks/useThemedStyles';
import { useNavigation } from '@react-navigation/native';
import type { OnboardingStackParamList } from 'components/navigation/OnboardingStack';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'Welcome'>;

export default function OnboardingWelcomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const styles = useThemedStyles();

  const handleContinue = () => {
    navigation.navigate('PersonalInfo');
  };

  return (
    <GradientBackground>
      <View className="flex-1 items-center justify-center p-6">
        <View>
          <Image source={require('assets/welcome-image.png')} resizeMode="contain" />
        </View>

        {/* Welcome Text */}
        <View className="mb-8 items-center">
          <Text className={`mb-4 text-center text-4xl font-bold ${styles.textPrimary}`}>
            Welcome to Relately
          </Text>
          <Text className={`px-4 text-center text-lg leading-6 ${styles.textSecondary}`}>
            Please answer a few questions to personalize your experience
          </Text>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          className={`h-14 w-full max-w-sm items-center justify-center rounded-xl ${styles.accentBg}`}
          onPress={handleContinue}
          activeOpacity={0.8}>
          <Text className="text-lg font-semibold text-white">Continue</Text>
        </TouchableOpacity>
      </View>
    </GradientBackground>
  );
}
