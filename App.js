// App.js
import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { Feather, MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AppState } from 'react-native';

import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import WordListScreen from './screens/WordListScreen';
import WordScreen from './screens/WordScreen';

import { PrefsProvider } from './context/PrefsContext';
import blocks from './data/blocks.json';
import { initAudio } from './services/audioManager.js';

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

function AppRoot() {
  useEffect(() => {
    // one-time init
    initAudio();

    // re-assert audio mode when app returns to foreground (Android quirk safeguard)
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') initAudio();
    });
    return () => sub.remove();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            backgroundColor: '#6B8CC8',
            borderTopColor: '#6B8CC8',
            borderTopWidth: 1,
            height: 80,
          },
          tabBarItemStyle: { paddingTop: 8 },
          tabBarIconStyle: { marginBottom: 4 },
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: '600',
            paddingBottom: 8,
          },
          tabBarActiveTintColor: '#FFFFFF',
          tabBarInactiveTintColor: 'rgba(255,255,255,0.7)',
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Feather name="home" size={size ?? 26} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="List"
          component={ListStack}
          options={{
            tabBarLabel: 'List',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="list" size={size ?? 32} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Word"
          component={WordStack}
          options={{
            tabBarLabel: 'Word',
            tabBarIcon: ({ color, size }) => (
              <Feather name="book" size={size ?? 26} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Feather name="settings" size={size ?? 26} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <PrefsProvider>
      <AppRoot />
    </PrefsProvider>
  );
}
