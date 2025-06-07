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

type SignUpScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;
};

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const styles = useThemedStyles();

  const handleSignUp = async (): Promise<void> => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.session === null) {
        Alert.alert(
          'Check your email',
          'We sent you a confirmation email. Please check your email to complete your registration.'
        );
      }
    } catch (error: any) {
      Alert.alert('Error signing up', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground>
      <View className="flex-1 justify-center p-5">
        <Text className={`mb-2 text-center text-3xl font-bold ${styles.textPrimary}`}>
          Create Account
        </Text>
        <Text className={`mb-8 text-center text-base ${styles.textPrimary}`}>
          Sign up for RelatelyAI
        </Text>

        <TextInput
          className={`mb-4 h-12 rounded-lg px-4 text-base ${styles.border} border ${styles.cardBackground}`}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor={styles.textSecondary.includes('mauve-mist') ? '#C8A4B7' : '#6B7280'}
        />

        <TextInput
          className={`mb-4 h-12 rounded-lg px-4 text-base ${styles.border} border ${styles.cardBackground}`}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={styles.textSecondary.includes('mauve-mist') ? '#C8A4B7' : '#6B7280'}
        />

        <TextInput
          className={`mb-4 h-12 rounded-lg px-4 text-base ${styles.border} border ${styles.cardBackground}`}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholderTextColor={styles.textSecondary.includes('mauve-mist') ? '#C8A4B7' : '#6B7280'}
        />

        <TouchableOpacity
          className={`mt-2 h-12 items-center justify-center rounded-lg ${loading ? 'opacity-60' : ''} ${styles.accentBg}`}
          onPress={handleSignUp}
          disabled={loading}>
          <Text className="text-base font-bold text-white">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('SignIn')}
          className="mt-5 items-center">
          <Text className={`text-base ${styles.accent}`}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </View>
    </GradientBackground>
  );
};

export default SignUpScreen;
