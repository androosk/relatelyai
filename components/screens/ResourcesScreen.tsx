import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';

type Resource = {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'article' | 'video' | 'book' | 'podcast';
};

const resources: Resource[] = [
  {
    id: '1',
    title: 'The 5 Love Languages',
    description: 'Learn about the different ways people express and receive love.',
    url: 'https://www.5lovelanguages.com/',
    type: 'book',
  },
  {
    id: '2',
    title: 'Gottman Institute: The Four Horsemen',
    description: 'Understanding the four communication styles that predict relationship failure.',
    url: 'https://www.gottman.com/blog/the-four-horsemen-recognizing-criticism-contempt-defensiveness-and-stonewalling/',
    type: 'article',
  },
  {
    id: '3',
    title: 'Esther Perel: The Secret to Desire in a Long-Term Relationship',
    description: 'TED Talk on maintaining desire in long-term relationships.',
    url: 'https://www.ted.com/talks/esther_perel_the_secret_to_desire_in_a_long_term_relationship',
    type: 'video',
  },
  {
    id: '4',
    title: 'Where Should We Begin? Podcast',
    description: 'Real couples discuss their relationship challenges with therapist Esther Perel.',
    url: 'https://www.estherperel.com/podcast',
    type: 'podcast',
  },
  {
    id: '5',
    title: 'Relationship Therapy Directory',
    description: 'Find a qualified relationship therapist near you.',
    url: 'https://www.psychologytoday.com/us/therapists/couples-counseling',
    type: 'article',
  },
];

export default function ResourcesScreen() {
  const openUrl = (url: string) => {
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
  };

  type iconType = 'newspaper-o' | 'play-circle-o' | 'book' | 'microphone' | 'link';

  const getIconName = (type: string): iconType => {
    switch (type) {
      case 'article':
        return 'newspaper-o';
      case 'video':
        return 'play-circle-o';
      case 'book':
        return 'book';
      case 'podcast':
        return 'microphone';
      default:
        return 'link';
    }
  };

  const renderResourceCard = (resource: Resource) => (
    <TouchableOpacity
      key={resource.id}
      className="mb-4 rounded-lg bg-white p-4 shadow"
      onPress={() => openUrl(resource.url)}>
      <View className="mb-2 flex-row items-center">
        <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
          <FontAwesome name={getIconName(resource.type)} size={20} color="#4f46e5" />
        </View>
        <Text className="flex-1 text-lg font-semibold">{resource.title}</Text>
      </View>
      <Text className="mb-3 text-gray-600">{resource.description}</Text>
      <View className="flex-row items-center justify-between">
        <View className="rounded-full bg-gray-100 px-3 py-1">
          <Text className="text-sm capitalize text-gray-600">{resource.type}</Text>
        </View>
        <Text className="font-medium text-indigo-600">View Resource →</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-4 py-6">
        <Text className="mb-6 text-2xl font-bold text-indigo-600">Relationship Resources</Text>

        <Text className="mb-6 text-base text-gray-600">
          Explore these resources to improve your relationship skills and understand relationship
          dynamics better.
        </Text>

        {resources.map(renderResourceCard)}

        <View className="mt-6 rounded-lg bg-indigo-50 p-4">
          <Text className="mb-2 text-base font-medium text-indigo-800">Need immediate help?</Text>
          <Text className="mb-3 text-gray-700">
            If you're experiencing relationship abuse or need immediate support, please reach out to
            these resources:
          </Text>
          <TouchableOpacity
            className="mb-2 flex-row items-center"
            onPress={() => Linking.openURL('tel:18007997233')}>
            <FontAwesome name="phone" size={16} color="#4f46e5" className="mr-2" />
            <Text className="text-indigo-600">
              National Domestic Violence Hotline: 1-800-799-7233
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
