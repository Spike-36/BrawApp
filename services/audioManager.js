// services/audioManager.js  (or lib/audioManager.js if that's your path)
import { Audio } from 'expo-av';
import { audioMap } from '../components/audioMap';

let mainSound = null;
let currentToken = 0; // identifies the latest play call

// Re-apply mode each call (cheap; fixes Android focus quirks)
export async function initAudio() {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false, // true background needs native build
      playsInSilentModeIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      shouldDuckAndroid: false,
      playThroughEarpieceAndroid: false,
    });
  } catch (e) {
    console.warn('Audio init failed:', e?.message || e);
  }
}

async function stopAndUnload(sound) {
  if (!sound) return;
  try { await sound.stopAsync(); } catch {}
  try { await sound.unloadAsync(); } catch {}
}

// Race-safe: snapshot then clear shared ref before unloading
export async function unloadMain() {
  const s = mainSound;
  mainSound = null;
  await stopAndUnload(s);
}

export async function playByKey(id, field = 'audioScottish') {
  const entry = audioMap?.[id];
  const module = entry?.[field];
  if (!module) {
    console.warn(`Missing ${field} for id:`, id);
    return;
  }

  const token = ++currentToken; // mark this play as the latest

  // Clear previous instance first (safe if nothing loaded)
  await unloadMain();

  let sound;
  try {
    const created = await Audio.Sound.createAsync(module, { shouldPlay: false });
    sound = created.sound;

    // If a newer play started while loading, drop this one quietly
    if (token !== currentToken) {
      await stopAndUnload(sound);
      return;
    }

    mainSound = sound;
    try { await mainSound.setVolumeAsync(1.0); } catch {}
    await mainSound.playAsync();

    mainSound.setOnPlaybackStatusUpdate((s) => {
      // keep instance for possible replay; cleanup happens on next play/unload
      if (s?.isLoaded && s.didJustFinish && token === currentToken) {
        // no-op
      }
    });
  } catch (e) {
    console.warn('playByKey error:', e?.message || e);
    await stopAndUnload(sound);
  }
}

export async function replay() {
  try { if (mainSound) await mainSound.replayAsync(); } catch (e) {
    console.warn('replay failed:', e?.message || e);
  }
}

export async function stop() {
  await stopAndUnload(mainSound);
  mainSound = null;
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
        await stopAndUnload(sound);
      }
    });
    await sound.playAsync();
  } catch (e) {
    console.warn('playContextByKey error:', e?.message || e);
  }
}
