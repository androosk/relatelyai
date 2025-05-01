import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { profileService } from 'components/services/profileService';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'App';

type EditProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditProfile'>;

type EditProfileScreenProps = {
  navigation: EditProfileScreenNavigationProp;
};

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [relationshipStatus, setRelationshipStatus] = useState<string>('');
  const [partnerName, setPartnerName] = useState<string>('');
  const { getProfile, updateProfile } = profileService;

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile(): Promise<void> {
    try {
      setLoading(true);
      const profile = await getProfile();

      if (profile) {
        setUsername(profile.username || '');
        setRelationshipStatus(profile.relationship_status || '');
        setPartnerName(profile.partner_name || '');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile information');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(): Promise<void> {
    try {
      setUpdating(true);

      const { error } = await updateProfile({
        username,
        relationship_status: relationshipStatus,
        partner_name: partnerName,
      });

      if (error) throw error;

      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setUpdating(false);
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
        <Text className="mb-6 text-center text-2xl font-bold text-gray-800">Edit Profile</Text>

        <View className="mb-4">
          <Text className="mb-2 text-sm font-medium text-gray-500">Username</Text>
          <TextInput
            className="rounded-lg border border-gray-300 px-4 py-3 text-gray-800"
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username"
          />
        </View>

        <View className="mb-4">
          <Text className="mb-2 text-sm font-medium text-gray-500">Relationship Status</Text>
          <View className="overflow-hidden rounded-lg border border-gray-300">
            <Picker
              selectedValue={relationshipStatus}
              onValueChange={(value) => setRelationshipStatus(value)}
              className="h-12">
              <Picker.Item label="Select status" value="" />
              <Picker.Item label="Single" value="Single" />
              <Picker.Item label="Dating" value="Dating" />
              <Picker.Item label="Engaged" value="Engaged" />
              <Picker.Item label="Married" value="Married" />
              <Picker.Item label="It's complicated" value="Complicated" />
            </Picker>
          </View>
        </View>

        {relationshipStatus !== 'Single' && relationshipStatus !== '' && (
          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-gray-500">Partner Name</Text>
            <TextInput
              className="rounded-lg border border-gray-300 px-4 py-3 text-gray-800"
              value={partnerName}
              onChangeText={setPartnerName}
              placeholder="Enter partner's name"
            />
          </View>
        )}

        <TouchableOpacity
          className="mt-6 items-center rounded-lg bg-indigo-600 px-4 py-3"
          onPress={handleSave}
          disabled={updating}>
          {updating ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="font-semibold text-white">Save Changes</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-3 rounded-lg border border-gray-400 px-4 py-3"
          onPress={() => navigation.goBack()}
          disabled={updating}>
          <Text className="text-center font-semibold text-gray-600">Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditProfileScreen;
