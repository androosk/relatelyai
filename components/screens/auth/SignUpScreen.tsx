import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AuthScreen from './AuthScreen';

type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

type SignUpScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;
};

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  return <AuthScreen navigation={navigation} mode="signup" />;
};

export default SignUpScreen;
