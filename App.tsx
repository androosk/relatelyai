import './global.css';
import { ThemeProvider } from 'components/contexts/ThemeContext';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ChatProvider } from 'components/contexts/ChatContext';
import CheckInScreen from './components/screens/CheckInScreen';
import ResourcesScreen from './components/screens/ResourcesScreen';
import HomeScreen from './components/screens/HomeScreen';
import ProfileScreen from './components/screens/ProfileScreen';
import EditProfileScreen from './components/screens/EditProfileScreen';
import { QuizStackNavigator } from 'components/navigation/QuizStack';
import { ChatStackNavigator } from 'components/navigation/ChatStack';
import SignInScreen from './components/screens/auth/SignInScreen';
import SignUpScreen from './components/screens/auth/SignUpScreen';
import { AuthProvider, useAuth } from './components/contexts/AuthContext';
import { GradientBackground } from 'components/ui/GradientBackground';
import OnboardingWelcomeScreen from 'components/screens/onboarding/WelcomeScreen';

export type RootStackParamList = {
  App: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Profile: undefined;
  EditProfile: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Assessment: undefined;
  'Check In': undefined;
  Chat: undefined;
  Resources: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: 'home' | 'list-ol' | 'calendar-check-o' | 'comments' | 'book' = 'book';
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Assessment') {
            iconName = 'list-ol';
          } else if (route.name === 'Check In') {
            iconName = 'calendar-check-o';
          } else if (route.name === 'Chat') {
            iconName = 'comments';
          } else if (route.name === 'Resources') {
            iconName = 'book';
          }

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6366f1', // Indigo color
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Assessment" component={QuizStackNavigator} />
      <Tab.Screen name="Check In" component={CheckInScreen} />
      <Tab.Screen name="Chat" component={ChatStackNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="Resources" component={ResourcesScreen} />
    </Tab.Navigator>
  );
}

const RootNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen name="App" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
          <Stack.Screen
            name="SignUp"
            component={OnboardingWelcomeScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <SafeAreaProvider>
          <AuthProvider>
            <ChatProvider>
              <RootNavigator />
            </ChatProvider>
          </AuthProvider>
        </SafeAreaProvider>
      </NavigationContainer>
    </ThemeProvider>
  );
}
