// lib/audioManager.js
import { Audio } from 'expo-av';
// If your audioMap is a *named* export (your code shows it is):
import { audioMap } from '../components/audioMap';
// If it's a default export in your project, switch to:
// import audioMap from '../components/audioMap';

let mainSound = null;
let isPlayingLock = false;

export async function initAudio() {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false, // true background requires native build
      playsInSilentModeIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      shouldDuckAndroid: false,       // important for Android
      playThroughEarpieceAndroid: false,
    });
  } catch (e) {
    console.warn('Audio init failed:', e?.message || e);
  }
}

export async function unloadMain() {
  try {
    if (mainSound) {
      await mainSound.stopAsync().catch(() => {});
      await mainSound.unloadAsync().catch(() => {});
    }
  } finally {
    mainSound = null;
    isPlayingLock = false;
  }
}

export async function playByKey(id, field = 'audioScottish') {
  const entry = audioMap?.[id];
  const module = entry?.[field];
  if (!module) {
    console.warn(`Missing ${field} for id:`, id);
    return;
  }

  if (isPlayingLock) return;
  isPlayingLock = true;

  try {
    await unloadMain();
    const { sound } = await Audio.Sound.createAsync(module, { shouldPlay: false });
    mainSound = sound;

    try { await mainSound.setVolumeAsync(1.0); } catch {}
    await mainSound.playAsync();

    mainSound.setOnPlaybackStatusUpdate((s) => {
      if (s?.isLoaded && s.didJustFinish) isPlayingLock = false;
    });
  } catch (e) {
    console.warn('playByKey error:', e?.message || e);
    isPlayingLock = false;
  }
}

export async function replay() {
  try {
    if (mainSound) await mainSound.replayAsync();
  } catch (e) {
    console.warn('replay failed:', e?.message || e);
  }
}

export async function stop() {
  try {
    if (mainSound) await mainSound.stopAsync();
  } catch {}
}

export async function playContextByKey(id, field = 'audioScottishContext') {
  const entry = audioMap?.[id];
  const module = entry?.[field];
  if (!module) {
    console.warn(`Missing ${field} for id:`, id);
    return;
  }

  try {
    const { sound } = await Audio.Sound.createAsync(module, { shouldPlay: false });
    sound.setOnPlaybackStatusUpdate(async (s) => {
      if (s?.isLoaded && s.didJustFinish) {
        try { await sound.unloadAsync(); } catch {}
      }
    });
    await sound.playAsync();
  } catch (e) {
    console.warn('playContextByKey error:', e?.message || e);
  }
}
