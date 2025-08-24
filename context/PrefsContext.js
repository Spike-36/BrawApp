// context/PrefsContext.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CODE_MAP as LANG_CODE_MAP, VISIBLE_INDEX_LANGS } from '../constants/languages'; // <- single source of truth

const DEFAULT_PREFS = { indexLang: 'English', autoplay: false };

const Ctx = createContext({
  ...DEFAULT_PREFS,
  uiLangCode: 'en',
  setIndexLang: (_l) => {},
  setAutoplay: (_v) => {},
});

export function PrefsProvider({ children }) {
  const [indexLang, setIndexLang] = useState(DEFAULT_PREFS.indexLang);
  const [autoplay, setAutoplay] = useState(DEFAULT_PREFS.autoplay);

  // Load saved prefs (language only)
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('@prefs');
        if (raw) {
          const saved = JSON.parse(raw);
          if (saved.indexLang && VISIBLE_INDEX_LANGS.includes(saved.indexLang)) {
            setIndexLang(saved.indexLang);
          }
        }
      } catch {}
    })();
  }, []);

  // Persist language (not autoplay)
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem('@prefs', JSON.stringify({ indexLang }));
      } catch {}
    })();
  }, [indexLang]);

  // Clamp to allowed set if anything invalid sneaks in
  useEffect(() => {
    if (!VISIBLE_INDEX_LANGS.includes(indexLang)) {
      setIndexLang(VISIBLE_INDEX_LANGS[0]);
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
