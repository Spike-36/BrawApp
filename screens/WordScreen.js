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
    const audioKey = word?.id;

    console.log('🔄 Loading word:', audioKey);

    const loadAndPlay = async () => {
      if (!audioKey || !audioMap[audioKey]?.audioScottish) {
        console.warn('⚠️ Missing audio file for:', `${audioKey}.scottish.mp3`);
        return;
      }

      try {
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current.setOnPlaybackStatusUpdate(null);
          soundRef.current = null;
        }

        const { sound } = await Audio.Sound.createAsync(audioMap[audioKey].audioScottish);
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
  }, [word?.id]);

  const playAudio = async () => {
    if (!soundRef.current) return;
    try {
      await soundRef.current.replayAsync();
    } catch (err) {
      console.warn('❌ Manual replay failed:', err.message);
    }
  };

  const playContextAudio = async () => {
    if (!word?.id || !audioMap[word.id]?.audioScottishContext) return;
    try {
      const { sound } = await Audio.Sound.createAsync(audioMap[word.id].audioScottishContext);
      await sound.playAsync();
    } catch (err) {
      console.warn('❌ Context audio error:', err.message);
    }
  };

  const goToPrev = () => {
    const prevIndex = (index - 1 + words.length) % words.length;
    console.log('⬅️ Navigating to previous word:', prevIndex);
    navigation.navigate('Word', {
      screen: 'WordMain',
      params: { words, index: prevIndex },
    });
  };

  const goToNext = () => {
    const nextIndex = (index + 1) % words.length;
    console.log('➡️ Navigating to next word:', nextIndex);
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
