// screens/WordScreen.js
import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

import colors from '../components/colors';
import WordRecordLayout from '../components/WordRecordLayout';
import { usePrefs } from '../context/PrefsContext';
import {
  cleanupPreload,
  playByKey,
  playContextByKey,
  preloadByKey,
  unloadMain,
} from '../services/audioManager';
import { pickContext, pickMeaning } from '../utils/langPickers';

export default function WordScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { words, index = 0 } = route.params || {};
  const { indexLang } = usePrefs();

  if (!words || !Array.isArray(words) || index < 0 || index >= words.length) {
    return <View style={styles.container} />;
  }

  const word = words[index];
  const audioKey = word?.id;

  // --- Contexts (EN always; alt only when indexLang !== 'English') ---
  const englishContext = pickContext(word, 'English');
  const altContext = indexLang !== 'English' ? pickContext(word, indexLang) : '';

  // Auto-play when screen gains focus
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      (async () => {
        if (!audioKey) return;
        await unloadMain();
        if (Platform.OS === 'android') {
          await new Promise((r) => setTimeout(r, 120));
        }
        if (!cancelled) {
          await playByKey(audioKey, 'audioScottish');
        }
      })();

      return () => {
        cancelled = true;
        unloadMain();
      };
    }, [audioKey])
  );

  // Preload next & previous audio clips
  useEffect(() => {
    const nextIdx = (index + 1) % words.length;
    const prevIdx = (index - 1 + words.length) % words.length;
    const nextId = words[nextIdx]?.id;
    const prevId = words[prevIdx]?.id;

    if (nextId) preloadByKey(nextId, 'audioScottish');
    if (prevId) preloadByKey(prevId, 'audioScottish');

    return () => cleanupPreload([audioKey]);
  }, [audioKey, index, words]);

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
          meaning={pickMeaning(word, indexLang)}
          // pass explicit contexts
          englishContext={englishContext}
          altContext={altContext}
          onPlayAudio={playAudio}
          onPlayContextAudio={playContextAudio}
        />
      </View>

      <View style={styles.navButtons}>
        <TouchableOpacity onPress={goToPrev} accessibilityLabel="Previous word">
          <Feather name="chevron-left" size={48} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity onPress={goToNext} accessibilityLabel="Next word">
          <Feather name="chevron-right" size={48} color="#888" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'flex-start' },
  topHalf: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingBottom: 30,
  },
});
