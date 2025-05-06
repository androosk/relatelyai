import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { profileService, Profile } from 'components/services/profileService';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'App';
import { useAuth } from '../contexts/AuthContext';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

type ProfileScreenProps = {
  navigation: ProfileScreenNavigationProp;
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<Profile>();
  const { signOut } = useAuth();
  const { getProfile } = profileService;

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile(): Promise<void> {
    try {
      setLoading(true);
      const profile = await getProfile();

      if (profile) {
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile information');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout(): Promise<void> {
    try {
      await signOut();
      // Navigation will be handled by the auth context listener
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to log out');
    }
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 p-6">
      <View className="rounded-xl bg-white p-6 shadow-sm">
        <Text className="mb-6 text-center text-2xl font-bold text-gray-800">Your Profile</Text>

        {/* <View className="mb-4">
          <Text className="mb-1 text-sm font-medium text-gray-500">Username</Text>
          <Text className="text-lg font-medium text-gray-800">
            {userProfile?.username || 'Not set'}
          </Text>
        </View> */}

        <View className="mb-4">
          <Text className="mb-1 text-sm font-medium text-gray-500">First Name</Text>
          <Text className="text-lg font-medium text-gray-800">
            {userProfile?.first_name || 'Not set'}
          </Text>
        </View>

        <View className="mb-4">
          <Text className="mb-1 text-sm font-medium text-gray-500">Last Name</Text>
          <Text className="text-lg font-medium text-gray-800">
            {userProfile?.last_name || 'Not set'}
          </Text>
        </View>

        <View className="mb-4">
          <Text className="mb-1 text-sm font-medium text-gray-500">Relationship Status</Text>
          <Text className="text-lg font-medium text-gray-800">
            {userProfile?.relationship_status || 'Not set'}
          </Text>
        </View>

        {userProfile?.relationship_start_date && (
          <View className="mb-4">
            <Text className="mb-1 text-sm font-medium text-gray-500">{`First Date`}</Text>
            <Text className="text-lg font-medium text-gray-800">
              {userProfile?.relationship_start_date}
            </Text>
          </View>
        )}

        {userProfile?.anniversary_date && (
          <View className="mb-4">
            <Text className="mb-1 text-sm font-medium text-gray-500">{`Anniversary`}</Text>
            <Text className="text-lg font-medium text-gray-800">
              {userProfile?.anniversary_date}
            </Text>
          </View>
        )}

        {userProfile?.partner_name && (
          <View className="mb-4">
            <Text className="mb-1 text-sm font-medium text-gray-500">Partner Name</Text>
            <Text className="text-lg font-medium text-gray-800">{userProfile?.partner_name}</Text>
          </View>
        )}
        {userProfile?.partner_name && (
          <View className="mb-4">
            <Text className="mb-1 text-sm font-medium text-gray-500">{`${userProfile.partner_name}'s Birthday`}</Text>
            <Text className="text-lg font-medium text-gray-800">
              {userProfile?.partner_birthdate || 'Not set'}
            </Text>
          </View>
        )}

        <TouchableOpacity
          className="mt-6 rounded-lg bg-indigo-600 px-4 py-3"
          onPress={() => navigation.navigate('EditProfile')}>
          <Text className="text-center font-semibold text-white">Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-3 rounded-lg border border-red-500 px-4 py-3"
          onPress={handleLogout}>
          <Text className="text-center font-semibold text-red-500">Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileScreen;
