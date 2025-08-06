import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { audioMap } from '../components/audioMap';
import BottomNav from '../components/BottomNav';
import WordInteractionBlock from '../components/WordInteractionBlock';
import WordRecordLayout from '../components/WordRecordLayout'; // or 'WordRecordLayoutMVP'
import { getStage, loadProgress, updateWordStage } from '../utils/progressStorage';

export default function WordRecordScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { words, index = 0, mode = 'explore' } = route.params || {};

  if (!words || !Array.isArray(words) || index < 0 || index >= words.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>⚠️ Invalid word parameters</Text>
      </View>
    );
  }

  const word = words[index];
  const wordId = word?.id;
  const [progress, setProgress] = useState({});
  const [showTip, setShowTip] = useState(false);

  const soundRef = useRef(null);
  const stage = getStage(progress, wordId);

  useEffect(() => {
    loadProgress().then(setProgress);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadAndPlay = async () => {
      if (!word?.audio || !audioMap[word.audio]) {
        console.warn('⚠️ No audio found for:', word?.audio);
        return;
      }

      try {
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current.setOnPlaybackStatusUpdate(null);
          soundRef.current = null;
        }

        const { sound } = await Audio.Sound.createAsync(audioMap[word.audio]);
        soundRef.current = sound;

        if (isMounted) {
          await sound.playAsync();
        }
      } catch (err) {
        console.warn('❌ Audio load/play error:', err.message);
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
  }, [word?.audio]);

  const playAudio = async () => {
    if (!soundRef.current) {
      console.warn('⚠️ Sound not loaded');
      return;
    }

    try {
      await soundRef.current.replayAsync();
    } catch (err) {
      console.warn('❌ Manual audio playback error:', err.message);
    }
  };

  const handleSetStage = async (newStage) => {
    if (!wordId) return;
    await updateWordStage(wordId, newStage);
    const updated = await loadProgress();
    setProgress(updated);
  };

  const goToPrev = () => {
    const prevIndex = (index - 1 + words.length) % words.length;
    navigation.push('WordRecord', { words, index: prevIndex, mode });
  };

  const goToNext = () => {
    const nextIndex = (index + 1) % words.length;
    navigation.push('WordRecord', { words, index: nextIndex, mode });
  };

  return (
    <View style={styles.fixedContainer}>
      <StatusBar style="light" translucent backgroundColor="transparent" />

      <View style={styles.topHalf}>
        <WordRecordLayout
          block={word}
          showTipIcon
          showInfoIcon
          onPlayAudio={playAudio}
          onShowTip={() => setShowTip(true)}
          topContent={
            <>
              <Text style={{ color: 'white', fontSize: 36, fontWeight: '600' }}>
                {word?.scottish}
              </Text>
              <Text style={{ color: '#ccc', fontSize: 20, marginTop: 8 }}>
                {word?.phonetic}
              </Text>
            </>
          }
          bottomContent={null}
        />
      </View>

      <View style={styles.interactionBlock}>
        <WordInteractionBlock
          block={word}
          stage={stage}
          onStageChange={handleSetStage}
          onPlayAudio={playAudio}
          showStars={false}
          showInstruction={false}
        />
      </View>

      {showTip && (
        <View style={styles.tipOverlay}>
          <Text style={styles.tipText}>{word.tip}</Text>
          <Text style={styles.closeTip} onPress={() => setShowTip(false)}>✕</Text>
        </View>
      )}

      <View style={styles.navButtons}>
        <TouchableOpacity onPress={goToPrev}>
          <Feather
            name="chevron-left"
            size={48}
            color="#888"
            style={{ transform: [{ scaleX: 1 }, { scaleY: 1.4 }] }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={goToNext}>
          <Feather
            name="chevron-right"
            size={48}
            color="#888"
            style={{ transform: [{ scaleX: 1 }, { scaleY: 1.4 }] }}
          />
        </TouchableOpacity>
      </View>

      <BottomNav active={mode} />
    </View>
  );
}

const styles = StyleSheet.create({
  fixedContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'flex-start',
  },
  topHalf: {
    height: '58%',
    position: 'relative',
  },
  interactionBlock: {
    height: '42%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 30,
  },
  tipOverlay: {
    position: 'absolute',
    top: '30%',
    left: 20,
    right: 20,
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 12,
    zIndex: 999,
  },
  tipText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  closeTip: {
    color: '#FFD700',
    fontSize: 22,
    textAlign: 'center',
    marginTop: 16,
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingBottom: 0,
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  error: {
    marginTop: 40,
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
  },
});
