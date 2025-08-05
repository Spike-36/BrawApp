import { Entypo, Feather, MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { useEffect } from 'react';

// Screens
import ExploreIndexScreen from './screens/ExploreIndexScreen';
import ExploreStack from './screens/ExploreStack'; // ✅ replaces direct List screen
import HomeScreen from './screens/HomeScreen';
import WordStack from './screens/WordStack'; // ✅ stack with WordRecordScreen

const Tab = createBottomTabNavigator();

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
          tabBarActiveTintColor: '#FFD700',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: 'black',
            borderTopColor: '#222',
          },
          tabBarLabelStyle: { fontSize: 12 },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Feather name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Index"
          component={ExploreIndexScreen}
          options={{
            tabBarLabel: 'Index',
            tabBarIcon: ({ color, size }) => (
              <Entypo name="grid" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="List"
          component={ExploreStack} // ✅ now uses stack
          options={{
            tabBarLabel: 'List',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="list" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Word"
          component={WordStack}
          options={{
            tabBarLabel: 'Word',
            tabBarIcon: ({ color, size }) => (
              <Feather name="book-open" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
