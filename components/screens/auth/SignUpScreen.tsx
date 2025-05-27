import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { supabase } from 'api/supabase';

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
    <View className="flex-1 justify-center bg-white p-5">
      <Text className="mb-2 text-center text-3xl font-bold">Create Account</Text>
      <Text className="mb-8 text-center text-base text-gray-500">Sign up for RelatelyAI</Text>

      <TextInput
        className="mb-4 h-12 rounded-lg border border-gray-300 px-4 text-base"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        className="mb-4 h-12 rounded-lg border border-gray-300 px-4 text-base"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        className="mb-4 h-12 rounded-lg border border-gray-300 px-4 text-base"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity
        className={`mt-2 h-12 items-center justify-center rounded-lg ${loading ? 'bg-red-300' : 'bg-red-400'}`}
        onPress={handleSignUp}
        disabled={loading}>
        <Text className="text-base font-bold text-white">
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignIn')} className="mt-5 items-center">
        <Text className="text-base text-red-400">Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpScreen;
