import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { audioMap } from '../components/audioMap';
import colors from '../components/colors';
import WordRecordLayout from '../components/WordRecordLayout';

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
  const soundRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const loadAndPlay = async () => {
      if (!word?.audioScottish || !audioMap[word.audioScottish]) {
        console.warn('⚠️ Missing audio file for:', word?.audioScottish);
        return;
      }

      try {
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current.setOnPlaybackStatusUpdate(null);
          soundRef.current = null;
        }

        const { sound } = await Audio.Sound.createAsync(audioMap[word.audioScottish]);
        soundRef.current = sound;

        if (isMounted) {
          await sound.playAsync();
        }
      } catch (err) {
        console.warn('❌ Audio playback error:', err.message);
      }
    };

    loadAndPlay();

    return () => {
      isMounted = false;
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    };
  }, [word?.audioScottish]);

  const playAudio = async () => {
    if (!soundRef.current) return;
    try {
      await soundRef.current.replayAsync();
    } catch (err) {
      console.warn('❌ Manual replay failed:', err.message);
    }
  };

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
          topContent={
            <>
              <Text style={styles.mainText}>{word?.scottish}</Text>
              <Text style={styles.phonetic}>{word?.phonetic}</Text>
            </>
          }
          bottomContent={<Text style={styles.meaning}>{word?.meaning}</Text>}
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
  mainText: {
    fontSize: 36,
    color: colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  phonetic: {
    fontSize: 20,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  meaning: {
    fontSize: 18,
    color: colors.accent,
    textAlign: 'center',
    marginTop: 20,
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
