// hooks/useManagedAudio.js
import { Audio } from 'expo-av';
import { useCallback, useEffect, useRef } from 'react';

export default function useManagedAudio() {
  const soundRef = useRef(null);

  // Always unload the previous sound before a new one
  const unload = useCallback(async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync().catch(() => {});
        await soundRef.current.unloadAsync().catch(() => {});
      }
    } finally {
      soundRef.current = null;
    }
  }, []);

  // Android-safe: load first, then play explicitly
  const playOnce = useCallback(async (module) => {
    if (!module) throw new Error('No audio module provided to playOnce()');

    await unload();

    // Do NOT rely on { shouldPlay: true } — that can no-op on Android
    const { sound } = await Audio.Sound.createAsync(module, { shouldPlay: false });
    soundRef.current = sound;

    // Helpful on some devices
    try { await soundRef.current.setVolumeAsync(1.0); } catch {}

    await soundRef.current.playAsync();
  }, [unload]);

  const stop = useCallback(async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.setPositionAsync(0);
      }
    } catch {}
  }, []);

  useEffect(() => {
    return () => { unload(); };
  }, [unload]);

  return { playOnce, stop, unload };
}
