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

type SignInScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'SignIn'>;
};

const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const styles = useThemedStyles(); // Add this hook

  const handleSignIn = async (): Promise<void> => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      console.log('User signed in:', data);
    } catch (error: any) {
      Alert.alert('Error signing in', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground>
      <View className="flex-1 justify-center p-5">
        <Text className={`mb-2 text-center text-3xl font-bold ${styles.textPrimary}`}>
          Welcome to RelatelyAI
        </Text>
        <Text className={`mb-8 text-center text-base ${styles.textPrimary}`}>
          Sign in to continue
        </Text>

        <TextInput
          className={`mb-4 h-12 rounded-lg px-4 text-base ${styles.border} border ${styles.inputBackground} ${styles.inputText}`}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor={styles.textSecondary.includes('mauve-mist') ? '#C8A4B7' : '#6B7280'}
        />

        <TextInput
          className={`mb-4 h-12 rounded-lg px-4 text-base ${styles.border} border ${styles.inputBackground} ${styles.inputText}`}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={styles.textSecondary.includes('mauve-mist') ? '#C8A4B7' : '#6B7280'}
        />

        <TouchableOpacity
          className={`mt-2 h-12 items-center justify-center rounded-lg ${loading ? 'opacity-60' : ''} ${styles.accentBg}`}
          onPress={handleSignIn}
          disabled={loading}>
          <Text className="text-base font-bold text-white">
            {loading ? 'Signing In...' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('SignUp')}
          className="mt-5 items-center">
          <Text className={`text-base ${styles.accent}`}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </GradientBackground>
  );
};

export default SignInScreen;
