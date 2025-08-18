// screens/WordListScreen.js
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { audioMap } from '../components/audioMap';
import { usePrefs } from '../context/PrefsContext'; // ✅ bring in prefs
import blocks from '../data/blocks.json';
import { pickMeaning } from '../utils/langPickers';

const sortedBlocks = [...blocks].sort((a, b) => a.scottish.localeCompare(b.scottish));

export default function WordListScreen() {
  const navigation = useNavigation();
  const { indexLang } = usePrefs();   // ✅ get current language

  const handleLongPress = (index) => {
    navigation.navigate('Word', {
      screen: 'WordMain',
      params: {
        words: sortedBlocks,
        index,
        mode: 'explore',
      },
    });
  };

  const playAudio = async (id) => {
    const file = audioMap[id]?.audioScottish;
    if (!file) {
      console.warn('⚠️ Missing audio file for ID:', id);
      return;
    }
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
        data={sortedBlocks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => playAudio(item.id)}
            onLongPress={() => handleLongPress(index)}
          >
            <View style={styles.inlineRow}>
              {/* Scots word */}
              <Text style={styles.word}>{item.scottish}</Text>

              {/* Meaning in whichever language is active */}
              <Text style={styles.meaning}>
                {pickMeaning(item, indexLang)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#FAFAF8',
  },
  listContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  row: {
    paddingVertical: 14,
    borderBottomColor: '#DDD',
    borderBottomWidth: 1,
  },
  inlineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
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
  },
});
