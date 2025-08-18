// App.js
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import './i18n'; // initialize your i18n helper once

import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef } from 'react';
import { AppState } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';

import { Feather, MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import WordListScreen from './screens/WordListScreen';
import WordScreen from './screens/WordScreen';

import { PrefsProvider, usePrefs } from './context/PrefsContext';
import blocks from './data/blocks.json';
import { t } from './i18n';
import { initAudio } from './services/audioManager';
import FontProvider from './theme/fonts';

enableScreens(true);

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Map display name from PrefsContext -> i18n code
const CODE_MAP = {
  English: 'en',
  French: 'fr',
  Japanese: 'ja',
  Arabic: 'ar',
};

// ---- Stacks ----
function ListStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WordList" component={WordListScreen} />
      <Stack.Screen name="WordFromList" component={WordScreen} />
    </Stack.Navigator>
  );
}

function WordStack() {
  const initialParams = useMemo(() => ({ words: blocks, index: 0 }), []);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WordMain" component={WordScreen} initialParams={initialParams} />
    </Stack.Navigator>
  );
}

// Subtle nav theme
const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

function AppRoot() {
  const initOnceRef = useRef(false);
  const { indexLang } = usePrefs(); // <- read user’s chosen language
  const uiLangCode = CODE_MAP[indexLang] || 'en';

  useEffect(() => {
    if (!initOnceRef.current) {
      initOnceRef.current = true;
      initAudio();
    }
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') initAudio();
    });
    return () => sub.remove();
  }, []);

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style="light" />
      <Tab.Navigator
        initialRouteName="Home"
        detachInactiveScreens
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
            paddingBottom: 8,
            fontFamily: 'LibreBaskerville_400Regular',
          },
          tabBarActiveTintColor: '#FFFFFF',
          tabBarInactiveTintColor: 'rgba(255,255,255,0.7)',
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: t('home', uiLangCode),
            tabBarIcon: ({ color, size }) => (
              <Feather name="home" size={size ?? 26} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="List"
          component={ListStack}
          options={{
            tabBarLabel: t('list', uiLangCode),
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="list" size={size ?? 28} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Word"
          component={WordStack}
          options={{
            // If your locale files have "words": "Words", use that:
            tabBarLabel: t('words', uiLangCode),
            tabBarIcon: ({ color, size }) => (
              <Feather name="book" size={size ?? 26} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: t('settings', uiLangCode),
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
    <FontProvider>
      <PrefsProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AppRoot />
        </GestureHandlerRootView>
      </PrefsProvider>
    </FontProvider>
  );
}
