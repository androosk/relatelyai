import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AuthScreen from './AuthScreen';

type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

type SignInScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'SignIn'>;
};

const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  return <AuthScreen navigation={navigation} mode="signin" />;
};

export default SignInScreen;
