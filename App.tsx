import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import QuizScreen from './components/screens/QuizScreen';
import CheckInScreen from './components/screens/CheckInScreen';
import ChatScreen from './components/screens/ChatScreen';
import ResourcesScreen from './components/screens/ResourcesScreen';
import { FontAwesome } from '@expo/vector-icons';
import HomeScreen from 'components/screens/HomeScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: 'home' | 'list-ol' | 'calendar-check-o' | 'comments' | 'book' = 'book';
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Quiz') {
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
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }} // Hide the header for the home screen
      />
      <Tab.Screen name="Quiz" component={QuizScreen} />
      <Tab.Screen name="Check In" component={CheckInScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Resources" component={ResourcesScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
          {/* Add other screens that might need to be outside tabs */}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
