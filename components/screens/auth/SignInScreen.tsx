import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { supabase } from 'api/supabase';

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
    <View className="flex-1 justify-center bg-white p-5">
      <Text className="mb-2 text-center text-3xl font-bold">Welcome to RelatelyAI</Text>
      <Text className="mb-8 text-center text-base text-gray-500">Sign in to continue</Text>

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

      <TouchableOpacity
        className={`mt-2 h-12 items-center justify-center rounded-lg ${loading ? 'bg-red-300' : 'bg-red-400'}`}
        onPress={handleSignIn}
        disabled={loading}>
        <Text className="text-base font-bold text-white">
          {loading ? 'Signing In...' : 'Sign In'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')} className="mt-5 items-center">
        <Text className="text-base text-red-400">Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignInScreen;
