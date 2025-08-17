// services/audioManager.js
import { Audio } from 'expo-av';
import { audioMap } from '../components/audioMap';

let mainSound = null;
let currentToken = 0;              // identifies the latest play call
const preloadCache = new Map();    // key -> preloaded Audio.Sound

const keyFor = (id, field) => `${id}:${field}`;

async function ensureLoaded(sound, module) {
  const status = await sound.getStatusAsync();
  if (!status.isLoaded) {
    await sound.loadAsync(module, { shouldPlay: false }, true);
  }
  return sound.getStatusAsync();
}

async function primeForPlayback(sound) {
  // Make sure not muted and volume is sane
  try { await sound.setIsMutedAsync(false); } catch {}
  try { await sound.setVolumeAsync(1.0); } catch {}
  try { await sound.setPositionAsync(0); } catch {}
}

async function stopAndUnload(sound) {
  if (!sound) return;
  try { await sound.stopAsync(); } catch {}
  try { await sound.unloadAsync(); } catch {}
}

// Re-apply mode each call (cheap; fixes Android focus quirks)
export async function initAudio() {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      shouldDuckAndroid: true,             // helps regain focus
      playThroughEarpieceAndroid: false,   // route to speaker
    });
  } catch (e) {
    console.warn('Audio init failed:', e?.message || e);
  }
}

// Race-safe: snapshot then clear shared ref before unloading
export async function unloadMain() {
  const s = mainSound;
  mainSound = null;
  await stopAndUnload(s);
}

// ---------- Preload API ----------

export async function preloadByKey(id, field = 'audioScottish') {
  const entry = audioMap?.[id];
  const module = entry?.[field];
  if (!module) return;

  const k = keyFor(id, field);
  if (preloadCache.has(k)) {
    // Android can evict; re-ensure loaded
    try {
      const sound = preloadCache.get(k);
      await ensureLoaded(sound, module);
    } catch {}
    return;
  }

  try {
    const { sound } = await Audio.Sound.createAsync(module, { shouldPlay: false });
    await ensureLoaded(sound, module);
    preloadCache.set(k, sound);
  } catch {
    // best-effort only
  }
}

// Drop any preloaded sounds not in keepIds (by id only; field-agnostic).
export async function cleanupPreload(keepIds = []) {
  for (const [k, sound] of preloadCache.entries()) {
    const idPart = k.split(':')[0];
    if (!keepIds.includes(idPart)) {
      await stopAndUnload(sound);
      preloadCache.delete(k);
    }
  }
}

// ---------- Playback ----------

export async function playByKey(id, field = 'audioScottish') {
  const entry = audioMap?.[id];
  const module = entry?.[field];
  if (!module) {
    console.warn(`Missing ${field} for id:`, id);
    return;
  }

  const token = ++currentToken; // mark this play as the latest
  await unloadMain();

  let sound;
  try {
    const k = keyFor(id, field);
    const cached = preloadCache.get(k);
    if (cached) {
      sound = cached;
      preloadCache.delete(k);
    } else {
      const created = await Audio.Sound.createAsync(module, { shouldPlay: false });
      sound = created.sound;
    }

    // If a newer play started while creating, drop this one quietly
    if (token !== currentToken) {
      await stopAndUnload(sound);
      return;
    }

    // ANDROID SAFETY: guarantee loaded + primed even from cache
    await ensureLoaded(sound, module);
    await primeForPlayback(sound);

    mainSound = sound;

    // Try to play, then verify progress; if not, retry once after reload.
    const attemptPlay = async (isRetry = false) => {
      await mainSound.playAsync();
      // Give Android a beat to start
      await new Promise((r) => setTimeout(r, 120));
      const st = await mainSound.getStatusAsync();

      const looksSilent =
        st.isLoaded &&
        (!st.isPlaying || (st.positionMillis ?? 0) === 0) &&
        (st.durationMillis ?? 1) > 0;

      if (looksSilent && !isRetry) {
        // Reload and try once more
        await ensureLoaded(mainSound, module);
        await primeForPlayback(mainSound);
        await attemptPlay(true);
      }
    };

    await attemptPlay(false);

    mainSound.setOnPlaybackStatusUpdate((_s) => {
      // keep instance; cleanup happens on next play/unload
    });
  } catch (e) {
    console.warn('playByKey error:', e?.message || e);
    await stopAndUnload(sound);
  }
}

export async function replay() {
  try {
    if (!mainSound) return;
    const st = await mainSound.getStatusAsync();
    if (!st.isLoaded) return;
    await primeForPlayback(mainSound);
    await mainSound.playAsync();
  } catch (e) {
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
  let sound;
  try {
    const created = await Audio.Sound.createAsync(module, { shouldPlay: false });
    sound = created.sound;
    await ensureLoaded(sound, module);
    await primeForPlayback(sound);
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate(async (s) => {
      if (s?.isLoaded && s.didJustFinish) {
        await stopAndUnload(sound);
      }
    });
  } catch (e) {
    console.warn('playContextByKey error:', e?.message || e);
    await stopAndUnload(sound);
  }
}
