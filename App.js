import { Feather, MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Audio } from 'expo-av';
import { useEffect } from 'react';

// Screens
import HomeScreen from './screens/HomeScreen';
import WordListScreen from './screens/WordListScreen';
import WordScreen from './screens/WordScreen';

// Data
import blocks from './data/blocks.json';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ListStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WordList" component={WordListScreen} />
      <Stack.Screen name="WordFromList" component={WordScreen} />
    </Stack.Navigator>
  );
}

function WordStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="WordMain"
        component={WordScreen}
        initialParams={{ words: blocks, index: 0 }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    const configureAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (err) {
        console.warn('Audio mode setup failed:', err);
      }
    };
    configureAudio();
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#6B8CC8',
            borderTopColor: '#6B8CC8',
            borderTopWidth: 1,
            height: 100,
          },
          tabBarItemStyle: {
            paddingTop: 10,
          },
          tabBarIconStyle: {
            marginBottom: 6, // Adjust to change spacing between icon and label
          },
          tabBarLabelStyle: {
            fontSize: 16, // Increased label size
            fontWeight: '600',
            paddingBottom: 12, // Adjust to move label up/down
            color: '#FFFFFF',
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: () => (
              <Feather name="home" size={26} color="#FFFFFF" />
            ),
          }}
        />
        <Tab.Screen
          name="List"
          component={ListStack}
          options={{
            tabBarLabel: 'List',
            tabBarIcon: () => (
              <MaterialIcons name="list" size={36} color="#FFFFFF" />
            ),
          }}
        />
        <Tab.Screen
          name="Word"
          component={WordStack}
          options={{
            tabBarLabel: 'Word',
            tabBarIcon: () => (
              <Feather name="book" size={26} color="#FFFFFF" />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
