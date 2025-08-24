// screens/WordScreen.js
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function WordScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { indexLang } = usePrefs();

  // params
  const wordsParam = route?.params?.words;
  const initialIndex = route?.params?.index ?? 0;

  const words = useMemo(() => (Array.isArray(wordsParam) ? wordsParam : []), [wordsParam]);
  const [currentIndex, setCurrentIndex] = useState(
    Math.min(Math.max(0, initialIndex), Math.max(0, words.length - 1))
  );

  const listRef = useRef(null);

  // Guard: nothing to show
  if (!words.length) {
    return <View style={styles.container} />;
  }

  const currentWord = words[currentIndex];
  const audioKey = currentWord?.id;

  // Contexts (EN always; alt only when indexLang !== 'English')
  const englishContext = pickContext(currentWord, 'English');
  const altContext = indexLang !== 'English' ? pickContext(currentWord, indexLang) : '';

  // ---- Audio: play on index change (and unload on change/unmount) ----
  useEffect(() => {
    let cancelled = false;

    (async () => {
      await unloadMain();

      // small Android buffer before replay to avoid clipping
      if (Platform.OS === 'android') {
        await new Promise((r) => setTimeout(r, 120));
      }

      if (!cancelled && audioKey) {
        await playByKey(audioKey, 'audioScottish');
      }
    })();

    return () => {
      cancelled = true;
      unloadMain();
    };
  }, [audioKey]);

  // Preload neighbors when index changes
  useEffect(() => {
    const nextIdx = Math.min(currentIndex + 1, words.length - 1);
    const prevIdx = Math.max(currentIndex - 1, 0);
    const nextId = words[nextIdx]?.id;
    const prevId = words[prevIdx]?.id;

    if (nextId) preloadByKey(nextId, 'audioScottish');
    if (prevId) preloadByKey(prevId, 'audioScottish');

    return () => cleanupPreload([audioKey]);
  }, [audioKey, currentIndex, words]);

  const playAudio = useCallback(async () => {
    if (audioKey) await playByKey(audioKey, 'audioScottish');
  }, [audioKey]);

  const playContextAudio = useCallback(async () => {
    if (audioKey) await playContextByKey(audioKey, 'audioScottishContext');
  }, [audioKey]);

  // --- Paging helpers ---
  const scrollTo = (idx) => {
    if (!listRef.current) return;
    const clamped = Math.min(Math.max(0, idx), words.length - 1);
    listRef.current.scrollToIndex({ index: clamped, animated: true });
  };

  const goToPrev = () => scrollTo(currentIndex - 1);
  const goToNext = () => scrollTo(currentIndex + 1);

  // Keep navigation params in sync (so other screens get the latest index)
  useEffect(() => {
    navigation.setParams?.({ words, index: currentIndex });
  }, [navigation, words, currentIndex]);

  // When parent passed a different initial index later, jump once
  useEffect(() => {
    if (initialIndex !== currentIndex) {
      // jump without animation to match the param
      listRef.current?.scrollToIndex?.({ index: initialIndex, animated: false });
      setCurrentIndex(Math.min(Math.max(0, initialIndex), words.length - 1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialIndex]);

  // Required for FlatList with initialScrollIndex
  const getItemLayout = useCallback((_, index) => {
    return { length: SCREEN_WIDTH, offset: SCREEN_WIDTH * index, index };
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={words}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        initialScrollIndex={currentIndex}
        getItemLayout={getItemLayout}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          const meaning = pickMeaning(item, indexLang);
          const englishCtx = pickContext(item, 'English');
          const altCtx = indexLang !== 'English' ? pickContext(item, indexLang) : '';
          const itemAudioKey = item?.id;

          return (
            <View style={{ width: SCREEN_WIDTH, flex: 1 }}>
              <View style={styles.topHalf}>
                <WordRecordLayout
                  block={item}
                  meaning={meaning}
                  englishContext={englishCtx}
                  altContext={altCtx}
                  onPlayAudio={() => itemAudioKey && playByKey(itemAudioKey, 'audioScottish')}
                  onPlayContextAudio={() =>
                    itemAudioKey && playContextByKey(itemAudioKey, 'audioScottishContext')
                  }
                />
              </View>
            </View>
          );
        }}
        onMomentumScrollEnd={(e) => {
          const next = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          if (next !== currentIndex) setCurrentIndex(next);
        }}
      />

      <View style={styles.navButtons}>
        <TouchableOpacity
          onPress={goToPrev}
          accessibilityLabel="Previous word"
          disabled={currentIndex <= 0}
        >
          <Feather name="chevron-left" size={48} color={currentIndex <= 0 ? '#444' : '#888'} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={goToNext}
          accessibilityLabel="Next word"
          disabled={currentIndex >= words.length - 1}
        >
          <Feather
            name="chevron-right"
            size={48}
            color={currentIndex >= words.length - 1 ? '#444' : '#888'}
          />
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
