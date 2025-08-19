// context/PrefsContext.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export const INDEX_LANGS = ['English', 'French', 'Japanese', 'Arabic'];

const DEFAULT_PREFS = { indexLang: 'English', autoplay: false };

// Display label → code
const LANG_CODE_MAP = {
  English:  'en',
  French:   'fr',
  Japanese: 'ja',
  Arabic:   'ar',
};

const Ctx = createContext({
  ...DEFAULT_PREFS,
  uiLangCode: 'en',          // <- expose the code too
  setIndexLang: (_l) => {},
  setAutoplay: (_v) => {},
});

export function PrefsProvider({ children }) {
  const [indexLang, setIndexLang] = useState(DEFAULT_PREFS.indexLang);
  const [autoplay, setAutoplay] = useState(DEFAULT_PREFS.autoplay);

  // Load saved prefs (only language)
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('@prefs');
        if (raw) {
          const saved = JSON.parse(raw);
          if (saved.indexLang && INDEX_LANGS.includes(saved.indexLang)) {
            setIndexLang(saved.indexLang);
          }
        }
      } catch {
        // ignore errors
      }
    })();
  }, []);

  // Persist only language (not autoplay)
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem('@prefs', JSON.stringify({ indexLang }));
      } catch {
        // ignore errors
      }
    })();
  }, [indexLang]);

  // sanity fallback if indexLang somehow invalid
  useEffect(() => {
    if (!INDEX_LANGS.includes(indexLang)) {
      setIndexLang(INDEX_LANGS[0]);
    }
  }, [indexLang]);

  const uiLangCode = LANG_CODE_MAP[indexLang] || 'en';

  const value = useMemo(
    () => ({ indexLang, setIndexLang, autoplay, setAutoplay, uiLangCode }),
    [indexLang, autoplay]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePrefs() {
  return useContext(Ctx);
}
