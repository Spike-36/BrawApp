// screens/WordScreen.js
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import colors from '../components/colors';
import WordRecordLayout from '../components/WordRecordLayout';
import { playByKey, playContextByKey, unloadMain } from '../services/audioManager.js';

export default function WordScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { words, index = 0 } = route.params || {};

  if (!words || !Array.isArray(words) || index < 0 || index >= words.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>⚠️ Invalid word parameters</Text>
      </View>
    );
  }

  const word = words[index];
  const audioKey = word?.id;

  // Auto-play main audio whenever word changes
  useEffect(() => {
    if (!audioKey) return;
    unloadMain(); // clear any previous audio
    playByKey(audioKey, 'audioScottish'); // auto play on load
    return () => unloadMain(); // cleanup on unmount or key change
  }, [audioKey]);

  const playAudio = useCallback(async () => {
    if (!audioKey) return;
    await playByKey(audioKey, 'audioScottish');
  }, [audioKey]);

  const playContextAudio = useCallback(async () => {
    if (!audioKey) return;
    await playContextByKey(audioKey, 'audioScottishContext');
  }, [audioKey]);

  const goToPrev = () => {
    const prevIndex = (index - 1 + words.length) % words.length;
    navigation.navigate('Word', {
      screen: 'WordMain',
      params: { words, index: prevIndex },
    });
  };

  const goToNext = () => {
    const nextIndex = (index + 1) % words.length;
    navigation.navigate('Word', {
      screen: 'WordMain',
      params: { words, index: nextIndex },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topHalf}>
        <WordRecordLayout
          block={word}
          onPlayAudio={playAudio}
          onPlayContextAudio={playContextAudio}
        />
      </View>

      <View style={styles.navButtons}>
        <TouchableOpacity onPress={goToPrev}>
          <Feather name="chevron-left" size={48} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity onPress={goToNext}>
          <Feather name="chevron-right" size={48} color="#888" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'flex-start',
  },
  topHalf: {
    flex: 1,
    justifyContent: 'center',
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingBottom: 30,
  },
  error: {
    color: colors.error,
    fontSize: 18,
    marginTop: 40,
    textAlign: 'center',
  },
});
