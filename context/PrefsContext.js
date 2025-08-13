// context/PrefsContext.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

// Keep your 12 index languages here (display labels can live in UI)
export const INDEX_LANGS = ['en','fr','de','es','it','pt','zh','ja','ko','th','tr','ar'];

const STORAGE_KEY = '@braw:prefs';
const DEFAULT_PREFS = {
  indexLang: 'en',
  autoplay: false,
};

const PrefsContext = createContext(null);

export function PrefsProvider({ children }) {
  const [indexLang, setIndexLang] = useState(DEFAULT_PREFS.indexLang);
  const [autoplay, setAutoplay] = useState(DEFAULT_PREFS.autoplay);
  const [hydrated, setHydrated] = useState(false); // optional: know when load finished

  // Load once
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) {
          setHydrated(true);
          return;
        }

        let saved;
        try {
          saved = JSON.parse(raw);
        } catch (e) {
          console.warn('[Prefs] JSON parse failed, resetting to defaults:', e);
          await AsyncStorage.removeItem(STORAGE_KEY);
          setHydrated(true);
          return;
        }

        // Validate and apply
        if (saved && typeof saved === 'object') {
          if (typeof saved.indexLang === 'string' && INDEX_LANGS.includes(saved.indexLang)) {
            setIndexLang(saved.indexLang);
          } else if (saved.indexLang !== undefined) {
            console.warn(`[Prefs] Invalid indexLang "${saved.indexLang}" — falling back to "${DEFAULT_PREFS.indexLang}"`);
          }

          if (typeof saved.autoplay === 'boolean') {
            setAutoplay(saved.autoplay);
          } else if (saved.autoplay !== undefined) {
            console.warn(`[Prefs] Invalid autoplay "${saved.autoplay}" — falling back to ${DEFAULT_PREFS.autoplay}`);
          }
        }
      } catch (err) {
        console.warn('[Prefs] Failed to load from storage:', err);
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  // Persist on change (after hydration to avoid writing defaults over valid storage during first render)
  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ indexLang, autoplay })
    ).catch((err) => {
      console.warn('[Prefs] Failed to save to storage:', err);
    });
  }, [indexLang, autoplay, hydrated]);

  // Helpers
  const setPrefs = (next = {}) => {
    if (typeof next.indexLang === 'string') {
      if (INDEX_LANGS.includes(next.indexLang)) setIndexLang(next.indexLang);
      else console.warn(`[Prefs] setPrefs: invalid indexLang "${next.indexLang}" ignored`);
    }
    if (typeof next.autoplay === 'boolean') setAutoplay(next.autoplay);
  };

  const resetPrefs = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn('[Prefs] Failed to clear storage:', err);
    } finally {
      setIndexLang(DEFAULT_PREFS.indexLang);
      setAutoplay(DEFAULT_PREFS.autoplay);
    }
  };

  const value = useMemo(
    () => ({
      hydrated,
      indexLang,
      setIndexLang,
      autoplay,
      setAutoplay,
      setPrefs,
      resetPrefs,
    }),
    [hydrated, indexLang, autoplay]
  );

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function usePrefs() {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error('usePrefs must be used inside PrefsProvider');
  return ctx;
}

// Optional exports if you want them elsewhere
export { DEFAULT_PREFS, STORAGE_KEY };
