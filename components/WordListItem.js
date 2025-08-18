// WordListItem.js
import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { audioMap } from '../components/audioMap';

export default function WordListItem({
  word,
  wordStage = 0,
  onPress,
  onUpdateProgress,
  persist = true,
}) {
  if (!word || typeof word !== 'object') {
    console.warn('Invalid word:', word);
    return null;
  }

  const [sound, setSound] = useState(null);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const handlePlay = async () => {
    if (!word.audio || !audioMap[word.audio]) {
      console.warn('⚠️ Audio not found for:', word.audio);
      return;
    }

    try {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }

      const { sound: newSound } = await Audio.Sound.createAsync(audioMap[word.audio]);
      setSound(newSound);
      await newSound.replayAsync();
    } catch (err) {
      console.warn('❌ Audio playback error:', err.message);
    }
  };

  return (
    <View style={styles.item}>
      {/* English: triggers navigation */}
      <TouchableOpacity onPress={onPress} style={styles.englishZone}>
        <Text style={styles.english}>{word.english}</Text>
      </TouchableOpacity>

      {/* Scots (foreign): triggers audio */}
      <View style={styles.scotsZone}>
        <TouchableOpacity onPress={handlePlay} style={styles.scotsWrapper}>
          <Text style={styles.scots}>{word.foreign}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#1c1c1c',
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  englishZone: {
    width: 130,
    marginRight: 8,
  },
  english: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'PlayfairDisplay_700Bold', // ✅ English in Playfair
  },
  scotsZone: {
    flex: 1,
    alignItems: 'flex-start',
    paddingLeft: 16,
  },
  scotsWrapper: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  scots: {
    fontSize: 18,
    color: '#aaa',
    textAlign: 'left',
    fontFamily: 'LibreBaskerville_700Bold', // ✅ Scots in Libre Baskerville
  },
});
