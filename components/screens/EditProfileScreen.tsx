import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Switch,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { StatusDropdown } from 'components/ui/StatusDropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
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
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [relationshipStatus, setRelationshipStatus] = useState<string>('');
  const [partnerName, setPartnerName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [textNotifications, setTextNotifications] = useState<boolean>(true);
  const [pushNotifications, setPushNotifications] = useState<boolean>(true);
  const [relationshipStartDate, setRelationshipStartDate] = useState<Date | null>(null);
  const [anniversaryDate, setAnniversaryDate] = useState<Date | null>(null);
  const [partnerBirthdate, setPartnerBirthdate] = useState<Date | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState<boolean>(false);
  const [showAnniversaryPicker, setShowAnniversaryPicker] = useState<boolean>(false);
  const [showBirthdatePicker, setShowBirthdatePicker] = useState<boolean>(false);

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
        setFirstName(profile.first_name || '');
        setLastName(profile.last_name || '');
        setAge(profile.age ? profile.age.toString() : '');
        setBio(profile.bio || '');
        setRelationshipStatus(profile.relationship_status || '');
        setPartnerName(profile.partner_name || '');
        setPhoneNumber(profile.phone_number || '');
        setEmailNotifications(
          profile.email_notifications !== null ? profile.email_notifications : true
        );
        setTextNotifications(
          profile.text_notifications !== null ? profile.text_notifications : true
        );
        setPushNotifications(
          profile.push_notifications !== null ? profile.push_notifications : true
        );

        if (profile.relationship_start_date) {
          setRelationshipStartDate(new Date(profile.relationship_start_date));
        }

        if (profile.anniversary_date) {
          setAnniversaryDate(new Date(profile.anniversary_date));
        }

        if (profile.partner_birthdate) {
          setPartnerBirthdate(new Date(profile.partner_birthdate));
        }
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
        first_name: firstName,
        last_name: lastName,
        age: age ? parseInt(age, 10) : null,
        bio,
        relationship_status: relationshipStatus,
        partner_name: partnerName,
        phone_number: phoneNumber,
        email_notifications: emailNotifications,
        text_notifications: textNotifications,
        push_notifications: pushNotifications,
        relationship_start_date: relationshipStartDate?.toISOString() || null,
        anniversary_date: anniversaryDate?.toISOString() || null,
        partner_birthdate: partnerBirthdate?.toISOString() || null,
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

  const onStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setRelationshipStartDate(selectedDate);
    }
  };

  const onAnniversaryChange = (event: any, selectedDate?: Date) => {
    setShowAnniversaryPicker(false);
    if (selectedDate) {
      setAnniversaryDate(selectedDate);
    }
  };

  const onBirthdateChange = (event: any, selectedDate?: Date) => {
    setShowBirthdatePicker(false);
    if (selectedDate) {
      setPartnerBirthdate(selectedDate);
    }
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return 'Not set';
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        <View className="rounded-xl bg-white p-6 shadow-sm">
          <Text className="mb-6 text-center text-2xl font-bold text-gray-800">Edit Profile</Text>

          {/* Basic Information */}
          <View className="mb-6">
            <Text className="mb-4 text-lg font-semibold text-gray-700">Basic Information</Text>

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
              <Text className="mb-2 text-sm font-medium text-gray-500">First Name</Text>
              <TextInput
                className="rounded-lg border border-gray-300 px-4 py-3 text-gray-800"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter first name"
              />
            </View>

            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-500">Last Name</Text>
              <TextInput
                className="rounded-lg border border-gray-300 px-4 py-3 text-gray-800"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter last name"
              />
            </View>

            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-500">Age</Text>
              <TextInput
                className="rounded-lg border border-gray-300 px-4 py-3 text-gray-800"
                value={age}
                onChangeText={setAge}
                placeholder="Enter age"
                keyboardType="numeric"
              />
            </View>

            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-500">Bio</Text>
              <TextInput
                className="rounded-lg border border-gray-300 px-4 py-3 text-gray-800"
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us about yourself"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Relationship Information */}
          <View className="mb-6">
            <Text className="mb-4 text-lg font-semibold text-gray-700">
              Relationship Information
            </Text>

            {/* <View className="mb-4">
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
            </View> */}
            <StatusDropdown value={relationshipStatus} setValue={setRelationshipStatus} />

            {relationshipStatus !== 'Single' && relationshipStatus !== '' && (
              <>
                <View className="mb-4">
                  <Text className="mb-2 text-sm font-medium text-gray-500">Partner Name</Text>
                  <TextInput
                    className="rounded-lg border border-gray-300 px-4 py-3 text-gray-800"
                    value={partnerName}
                    onChangeText={setPartnerName}
                    placeholder="Enter partner's name"
                  />
                </View>

                <View className="mb-4">
                  <Text className="mb-2 text-sm font-medium text-gray-500">
                    Relationship Start Date
                  </Text>
                  <TouchableOpacity
                    className="rounded-lg border border-gray-300 px-4 py-3"
                    onPress={() => setShowStartDatePicker(true)}>
                    <Text className="text-gray-800">
                      {relationshipStartDate ? formatDate(relationshipStartDate) : 'Select date'}
                    </Text>
                  </TouchableOpacity>
                  {showStartDatePicker && (
                    <DateTimePicker
                      value={relationshipStartDate || new Date()}
                      mode="date"
                      display="default"
                      onChange={onStartDateChange}
                    />
                  )}
                </View>

                <View className="mb-4">
                  <Text className="mb-2 text-sm font-medium text-gray-500">Anniversary Date</Text>
                  <TouchableOpacity
                    className="rounded-lg border border-gray-300 px-4 py-3"
                    onPress={() => setShowAnniversaryPicker(true)}>
                    <Text className="text-gray-800">
                      {anniversaryDate ? formatDate(anniversaryDate) : 'Select date'}
                    </Text>
                  </TouchableOpacity>
                  {showAnniversaryPicker && (
                    <DateTimePicker
                      value={anniversaryDate || new Date()}
                      mode="date"
                      display="default"
                      onChange={onAnniversaryChange}
                    />
                  )}
                </View>

                <View className="mb-4">
                  <Text className="mb-2 text-sm font-medium text-gray-500">Partner's Birthday</Text>
                  <TouchableOpacity
                    className="rounded-lg border border-gray-300 px-4 py-3"
                    onPress={() => setShowBirthdatePicker(true)}>
                    <Text className="text-gray-800">
                      {partnerBirthdate ? formatDate(partnerBirthdate) : 'Select date'}
                    </Text>
                  </TouchableOpacity>
                  {showBirthdatePicker && (
                    <DateTimePicker
                      value={partnerBirthdate || new Date()}
                      mode="date"
                      display="default"
                      onChange={onBirthdateChange}
                    />
                  )}
                </View>
              </>
            )}
          </View>

          {/* Notification Preferences */}
          <View className="mb-6">
            <Text className="mb-4 text-lg font-semibold text-gray-700">
              Notification Preferences
            </Text>

            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-500">Phone Number</Text>
              <TextInput
                className="rounded-lg border border-gray-300 px-4 py-3 text-gray-800"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Enter phone number for SMS notifications"
                keyboardType="phone-pad"
              />
            </View>

            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-sm font-medium text-gray-500">Email Notifications</Text>
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
                trackColor={{ false: '#767577', true: '#818CF8' }}
                thumbColor={emailNotifications ? '#6366F1' : '#f4f3f4'}
              />
            </View>

            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-sm font-medium text-gray-500">Text Notifications</Text>
              <Switch
                value={textNotifications}
                onValueChange={setTextNotifications}
                trackColor={{ false: '#767577', true: '#818CF8' }}
                thumbColor={textNotifications ? '#6366F1' : '#f4f3f4'}
              />
            </View>

            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-sm font-medium text-gray-500">Push Notifications</Text>
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: '#767577', true: '#818CF8' }}
                thumbColor={pushNotifications ? '#6366F1' : '#f4f3f4'}
              />
            </View>
          </View>

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
    </ScrollView>
  );
};

export default EditProfileScreen;
