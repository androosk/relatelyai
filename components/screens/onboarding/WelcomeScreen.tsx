import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GradientBackground } from 'components/ui/GradientBackground';
import { useThemedStyles } from 'hooks/useThemedStyles';

type OnboardingStackParamList = {
  Welcome: undefined;
  Questions: undefined;
  // Add other onboarding steps here
};

type OnboardingWelcomeScreenProps = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'Welcome'>;
};

const OnboardingWelcomeScreen: React.FC<OnboardingWelcomeScreenProps> = ({ navigation }) => {
  const styles = useThemedStyles();

  const handleContinue = () => {
    // Navigate to the next onboarding step
    navigation.navigate('Questions');
  };

  return (
    <GradientBackground>
      <View className="flex-1 items-center justify-center p-6">
        {/* Illustration */}
        <View className="">
          <Image
            source={require('assets/welcome-image.png')} // Update path to your image
            // className="h-80 w-80"
            resizeMode="contain"
          />
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
};

export default OnboardingWelcomeScreen;
