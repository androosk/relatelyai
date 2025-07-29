import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { supabase } from 'api/supabase';
import { GradientBackground } from 'components/ui/GradientBackground';
import { useThemedStyles } from 'hooks/useThemedStyles';

type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

type AuthScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'SignIn' | 'SignUp'>;
  mode: 'signin' | 'signup';
};

// Check if we're in development
const isDev = __DEV__;

const AuthScreen: React.FC<AuthScreenProps> = ({ navigation, mode }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const styles = useThemedStyles();

  const isSignUp = mode === 'signup';

  const handleAuth = async (): Promise<void> => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (isDev && !password) {
      Alert.alert('Error', 'Please enter a password');
      return;
    }

    try {
      setLoading(true);

      if (isDev) {
        // Use password auth in development
        if (isSignUp) {
          const { error } = await supabase.auth.signUp({
            email,
            password,
          });
          if (error) throw error;
          Alert.alert('Success', 'Account created! Please check your email to verify your account before signing in.');
        } else {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
        }
      } else {
        // Use magic link in production
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: isSignUp,
            emailRedirectTo: 'relatelyai://auth',
          },
        });

        if (error) throw error;

        Alert.alert(
          'Check your email!',
          'We sent you a magic link. Click the link in your email to sign in.',
          isSignUp ? [{ text: 'OK', onPress: () => navigation.navigate('SignIn') }] : undefined
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground>
      <View className="flex-1 justify-center p-5">
        <Text className={`mb-2 text-center text-3xl font-bold ${styles.textPrimary}`}>
          {isSignUp ? 'Create Account' : 'Welcome to RelatelyAI'}
        </Text>
        <Text className={`mb-8 text-center text-base ${styles.textPrimary}`}>
          {isSignUp ? 'Sign up for RelatelyAI' : 'Sign in to continue'}
        </Text>

        {!isDev && (
          <View className={`mb-2 rounded-xl p-4 ${styles.cardBackground}`}>
            <Text className={`text-center text-sm ${styles.textSecondary}`}>
              No passwords needed! We'll send you a secure link to sign in.
            </Text>
          </View>
        )}

        <TextInput
          className={`mb-4 h-14 rounded-xl px-4 text-base ${styles.border} border ${styles.cardBackground} ${styles.inputText}`}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor={styles.textSecondary}
          autoComplete="email"
        />

        {isDev && (
          <>
            <TextInput
              className={`mb-4 h-14 rounded-xl px-4 text-base ${styles.border} border ${styles.cardBackground} ${styles.inputText}`}
              placeholder="Password (dev only)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor={styles.textSecondary}
            />
            <Text className={`mb-2 text-center text-xs ${styles.textSecondary}`}>
              Using password auth for development
            </Text>
          </>
        )}

        <TouchableOpacity
          className={`h-14 items-center justify-center rounded-xl ${loading ? 'bg-gray-400' : 'bg-indigo-600'}`}
          onPress={handleAuth}
          disabled={loading}>
          <Text className="text-lg font-semibold text-white">
            {loading 
              ? (isDev ? (isSignUp ? 'Creating Account...' : 'Signing In...') : 'Sending magic link...') 
              : (isDev ? (isSignUp ? 'Sign Up' : 'Sign In') : 'Send Magic Link')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate(isSignUp ? 'SignIn' : 'SignUp')}
          className="mt-5 items-center">
          <Text className={`text-base ${styles.accent}`}>
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>
    </GradientBackground>
  );
};

export default AuthScreen;