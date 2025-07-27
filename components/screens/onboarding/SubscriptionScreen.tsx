import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GradientBackground } from 'components/ui/GradientBackground';
import { FontAwesome5 } from '@expo/vector-icons';
import { useThemedStyles } from 'hooks/useThemedStyles';
import type { OnboardingStackParamList } from 'components/navigation/OnboardingStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'Subscription'>;

interface PlanOption {
  id: string;
  title: string;
  price: string;
  period: string;
  description: string;
  save?: string;
  isPopular?: boolean;
  icon: string;
}

const PLANS: PlanOption[] = [
  {
    id: 'yearly',
    title: 'Yearly Plan',
    price: '$39.99/year',
    period: 'Just $3.33/month',
    description: 'Best value for committed couples',
    save: 'Save 77%',
    isPopular: true,
    icon: 'award',
  },
  {
    id: 'monthly',
    title: 'Monthly Plan',
    price: '$14.99/month',
    period: 'Billed monthly',
    description: 'Flexible month-to-month',
    icon: 'calendar-alt',
  },
];

export default function SubscriptionScreen() {
  const navigation = useNavigation<NavigationProp>();
  const styles = useThemedStyles();
  const [selectedPlan, setSelectedPlan] = useState<string>('yearly');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      // TODO: Implement actual IAP subscription logic
      console.log('Starting subscription for plan:', selectedPlan);
      
      // For now, just navigate to main app
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'App' as never }],
        });
      }, 1000);
    } catch (error) {
      console.error('Subscription error:', error);
      Alert.alert('Error', 'Unable to process subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkipForNow = () => {
    Alert.alert(
      'Skip for now?',
      'You can subscribe later from your profile to unlock all features.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'App' as never }],
            });
          },
        },
      ]
    );
  };

  const PlanOption = ({ plan }: { plan: PlanOption }) => (
    <TouchableOpacity
      onPress={() => setSelectedPlan(plan.id)}
      className={`mb-4 overflow-hidden rounded-xl ${
        selectedPlan === plan.id
          ? 'border-2 border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-900/20'
          : `border ${styles.border} ${styles.cardBackground}`
      }`}>
      {plan.isPopular && (
        <View className="bg-indigo-600 py-2">
          <Text className="text-center text-xs font-semibold uppercase tracking-wider text-white">
            Most Popular • Best Value
          </Text>
        </View>
      )}
      <View className="p-5">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <View className="flex-row items-center">
              <FontAwesome5
                name={plan.icon}
                size={20}
                color={selectedPlan === plan.id ? '#6366f1' : '#6b7280'}
                style={{ marginRight: 12 }}
              />
              <Text
                className={`text-lg font-semibold ${
                  selectedPlan === plan.id ? 'text-indigo-600 dark:text-indigo-400' : styles.textPrimary
                }`}>
                {plan.title}
              </Text>
            </View>
            <Text
              className={`mt-1 text-sm ${
                selectedPlan === plan.id ? 'text-indigo-600 dark:text-indigo-400' : styles.textSecondary
              }`}>
              {plan.description}
            </Text>
          </View>
          <View className="items-end">
            <Text
              className={`text-lg font-bold ${
                selectedPlan === plan.id ? 'text-indigo-600 dark:text-indigo-400' : styles.textPrimary
              }`}>
              {plan.price}
            </Text>
            <Text
              className={`text-xs ${
                selectedPlan === plan.id ? 'text-indigo-600 dark:text-indigo-400' : styles.textSecondary
              }`}>
              {plan.period}
            </Text>
            {plan.save && (
              <View className="mt-1 rounded-full bg-green-100 px-2 py-0.5 dark:bg-green-900/30">
                <Text className="text-xs font-semibold text-green-700 dark:text-green-400">
                  {plan.save}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <GradientBackground>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-6 pb-8 pt-24">
          {/* Header */}
          <View className="mb-8">
            <Text className={`text-3xl font-bold ${styles.textPrimary}`}>
              Unlock your relationship's full potential
            </Text>
            <Text className={`mt-2 text-base ${styles.textSecondary}`}>
              Get unlimited access to all features and both partners can use one subscription
            </Text>
          </View>

          {/* Features */}
          <View className={`mb-8 rounded-xl p-4 ${styles.cardBackground}`}>
            <Text className={`mb-3 text-base font-semibold ${styles.textPrimary}`}>
              What's included:
            </Text>
            {[
              'Unlimited AI therapy sessions',
              'Daily relationship check-ins',
              'Personalized insights & advice',
              'Relationship health assessments',
              'Partner account included',
              '7-day free trial',
            ].map((feature, index) => (
              <View key={index} className="mb-2 flex-row items-center">
                <FontAwesome5 name="check-circle" size={16} color="#10b981" />
                <Text className={`ml-3 text-sm ${styles.textPrimary}`}>{feature}</Text>
              </View>
            ))}
          </View>

          {/* Plan options */}
          {PLANS.map((plan) => (
            <PlanOption key={plan.id} plan={plan} />
          ))}

          <View className="flex-1" />

          {/* CTA Button */}
          <TouchableOpacity
            onPress={handleSubscribe}
            disabled={loading}
            className={`mb-4 h-14 items-center justify-center rounded-xl ${
              loading ? 'bg-gray-400' : 'bg-indigo-600'
            }`}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-lg font-semibold text-white">
                Start 7-Day Free Trial
              </Text>
            )}
          </TouchableOpacity>

          <Text className={`mb-4 text-center text-xs ${styles.textSecondary}`}>
            No payment due today • Cancel anytime
          </Text>

          {/* Skip option */}
          <TouchableOpacity onPress={handleSkipForNow} className="py-2">
            <Text className={`text-center text-sm ${styles.textSecondary}`}>
              Maybe later
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}