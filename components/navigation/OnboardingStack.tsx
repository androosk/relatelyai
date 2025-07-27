import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import PersonalInfoScreen from '../screens/onboarding/PersonalInfoScreen';
import RelationshipStatusScreen from '../screens/onboarding/RelationshipStatusScreen';
import RelationshipDetailsScreen from '../screens/onboarding/RelationshipDetailsScreen';
import PartnerInfoScreen from '../screens/onboarding/PartnerInfoScreen';
import LivingArrangementScreen from '../screens/onboarding/LivingArrangementScreen';
import SubscriptionScreen from '../screens/onboarding/SubscriptionScreen';

export type OnboardingStackParamList = {
  Welcome: undefined;
  PersonalInfo: undefined;
  RelationshipStatus: undefined;
  RelationshipDetails: undefined;
  PartnerInfo: undefined;
  LivingArrangement: undefined;
  Subscription: undefined;
  Completion: undefined;
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
      <Stack.Screen name="RelationshipStatus" component={RelationshipStatusScreen} />
      <Stack.Screen name="RelationshipDetails" component={RelationshipDetailsScreen} />
      <Stack.Screen name="PartnerInfo" component={PartnerInfoScreen} />
      <Stack.Screen name="LivingArrangement" component={LivingArrangementScreen} />
      <Stack.Screen name="Subscription" component={SubscriptionScreen} />
    </Stack.Navigator>
  );
}