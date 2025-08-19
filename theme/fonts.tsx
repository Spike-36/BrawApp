// theme/fonts.tsx
import { useFonts } from 'expo-font';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

// Libre Baskerville (Scottish only)
import {
    LibreBaskerville_400Regular,
    LibreBaskerville_700Bold,
} from '@expo-google-fonts/libre-baskerville';

// Playfair Display (everything else)
import {
    PlayfairDisplay_400Regular,
    PlayfairDisplay_400Regular_Italic, // ✅ correct italic export
    PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';

type Props = { children: React.ReactNode };

export default function FontProvider({ children }: Props) {
  const [fontsLoaded] = useFonts({
    // Libre
    LibreBaskerville_400Regular,
    LibreBaskerville_700Bold,
    // Playfair
    PlayfairDisplay_400Regular,
    PlayfairDisplay_400Regular_Italic, // ✅
    PlayfairDisplay_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
}
