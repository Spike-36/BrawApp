// services/audioManager.js
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { audioMap } from '../components/audioMap';

let mainSound = null;
let currentToken = 0;              // identifies the latest play call
const preloadCache = new Map();    // key -> preloaded Audio.Sound

const keyFor = (id, field) => `${id}:${field}`;

async function ensureLoaded(sound, module) {
  if (!sound) return { isLoaded: false };
  const status = await sound.getStatusAsync().catch(() => ({ isLoaded: false }));
  if (!status.isLoaded) {
    try {
      await sound.loadAsync(module, { shouldPlay: false }, true);
    } catch {
      return { isLoaded: false };
    }
  }
  return sound.getStatusAsync().catch(() => ({ isLoaded: false }));
}

async function primeForPlayback(sound) {
  if (!sound) return;
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
      // ❗ Expo 53+ requires enum values, not numbers
      interruptionModeIOS: InterruptionModeIOS.MixWithOthers,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
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

  // Ensure global audio mode before playback (helps Android focus)
  await initAudio();

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
    const st = await ensureLoaded(sound, module);
    if (!st?.isLoaded) {
      await stopAndUnload(sound);
      return;
    }
    await primeForPlayback(sound);

    mainSound = sound;

    // Try to play, then verify progress; if not, retry once after reload.
    const attemptPlay = async (isRetry = false) => {
      if (!mainSound) return;
      await mainSound.playAsync();
      // Give Android a beat to start
      await new Promise((r) => setTimeout(r, 120));
      const s = await mainSound.getStatusAsync().catch(() => null);

      const looksSilent =
        s?.isLoaded &&
        (!s.isPlaying || (s.positionMillis ?? 0) === 0) &&
        (s.durationMillis ?? 1) > 0;

      if (looksSilent && !isRetry) {
        await ensureLoaded(mainSound, module);
        await primeForPlayback(mainSound);
        await attemptPlay(true);
      }
    };

    await attemptPlay(false);

    if (mainSound) {
      mainSound.setOnPlaybackStatusUpdate((_s) => {
        // keep instance; cleanup happens on next play/unload
      });
    }
  } catch (e) {
    console.warn('playByKey error:', e?.message || e);
    await stopAndUnload(sound);
  }
}

export async function replay() {
  try {
    if (!mainSound) return;
    const st = await mainSound.getStatusAsync().catch(() => null);
    if (!st?.isLoaded) return;
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
  // Ensure audio mode (Android focus)
  await initAudio();

  let sound;
  try {
    const created = await Audio.Sound.createAsync(module, { shouldPlay: false });
    sound = created.sound;
    const st = await ensureLoaded(sound, module);
    if (!st?.isLoaded) {
      await stopAndUnload(sound);
      return;
    }
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
