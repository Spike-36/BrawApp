// screens/WordListScreen.js
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { audioMap } from '../components/audioMap';
import { VISIBLE_INDEX_LANGS } from '../constants/languages';
import { usePrefs } from '../context/PrefsContext';
import blocks from '../data/blocks.json';
import { pickMeaning } from '../utils/langPickers';

const REQUIRE_MEANING_FOR_DISPLAY_LANG = true;

const norm = (s) => (typeof s === 'string' ? s.trim() : '');

function resolveDisplayLang(indexLang) {
  return VISIBLE_INDEX_LANGS.includes(indexLang) ? indexLang : VISIBLE_INDEX_LANGS[0];
}

// Returns the best string to show: chosen language if present, else English, else ""
function getMeaningWithFallback(entry, langLabel) {
  const primary = norm(pickMeaning(entry, langLabel));     // e.g. "Italian"
  if (primary) return primary;
  const english = norm(pickMeaning(entry, 'English'));
  return english;
}

const sortedBlocks = [...blocks].sort((a, b) =>
  (a.scottish || '').localeCompare(b.scottish || '')
);

export default function WordListScreen() {
  const navigation = useNavigation();
  const { indexLang } = usePrefs();

  const displayLang = resolveDisplayLang(indexLang);

  const visibleBlocks = REQUIRE_MEANING_FOR_DISPLAY_LANG
    ? sortedBlocks.filter((item) => getMeaningWithFallback(item, displayLang))
    : sortedBlocks;

  const handleLongPress = (index) => {
    navigation.navigate('Word', {
      screen: 'WordMain',
      params: { words: visibleBlocks, index, mode: 'explore' },
    });
  };

  const playAudio = async (id) => {
    const file = audioMap[id]?.audioScottish;
    if (!file) return;
    try {
      const { sound } = await Audio.Sound.createAsync(file);
      await sound.playAsync();
    } catch (err) {
      console.warn('❌ Audio playback failed:', err);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <FlatList
        data={visibleBlocks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item, index }) => {
          const meaning = getMeaningWithFallback(item, displayLang);
          return (
            <TouchableOpacity
              style={styles.row}
              onPress={() => playAudio(item.id)}
              onLongPress={() => handleLongPress(index)}
            >
              <View style={styles.inlineRow}>
                <Text style={styles.word}>{item.scottish}</Text>
                <Text style={styles.meaning}>{meaning}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#FAFAF8' },
  listContainer: { paddingVertical: 20, paddingHorizontal: 16 },
  row: { paddingVertical: 14, borderBottomColor: '#DDD', borderBottomWidth: 1 },
  inlineRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  word: {
    color: '#2E2E2E',
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'LibreBaskerville_400Regular',
  },
  meaning: {
    color: '#666',
    fontSize: 18,
    marginLeft: 12,
    flexShrink: 1,
    textAlign: 'right',
    fontFamily: 'PlayfairDisplay_400Regular',
    marginTop: -1,
  },
});
