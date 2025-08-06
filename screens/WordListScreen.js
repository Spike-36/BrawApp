import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { audioMap } from '../components/audioMap';
import blocks from '../data/blocks.json';

const sortedBlocks = [...blocks].sort((a, b) => a.scottish.localeCompare(b.scottish));

export default function WordListScreen() {
  const navigation = useNavigation();

  const handleLongPress = (index) => {
    navigation.navigate('Word', {
      screen: 'WordRecord',
      params: {
        words: sortedBlocks,
        index,
        mode: 'explore',
      },
    });
  };

  const playAudio = async (filename) => {
    const file = audioMap[filename];
    if (!file) return;
    try {
      const { sound } = await Audio.Sound.createAsync(file);
      await sound.playAsync();
    } catch (err) {
      console.warn('Audio playback failed:', err);
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
            onPress={() => playAudio(item.audioScottish)}
            onLongPress={() => handleLongPress(index)}
          >
            <Text style={styles.text}>{item.scottish}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#FAFAF8', // light warm off-white
  },
  listContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  row: {
    paddingVertical: 14,
    borderBottomColor: '#DDD', // subtle line for light background
    borderBottomWidth: 1,
  },
  text: {
    color: '#2E2E2E', // charcoal
    fontSize: 20,
    fontWeight: '500',
  },
});
