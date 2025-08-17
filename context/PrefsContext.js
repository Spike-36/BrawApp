import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export const INDEX_LANGS = ["English", "French", "Japanese", "Arabic"];

const DEFAULT_PREFS = {
  indexLang: "English",
  autoplay: false,
};

const Ctx = createContext({
  ...DEFAULT_PREFS,
  setIndexLang: (_l) => {},
  setAutoplay: (_v) => {},
});

export function PrefsProvider({ children }) {
  const [indexLang, setIndexLang] = useState(DEFAULT_PREFS.indexLang);
  const [autoplay, setAutoplay] = useState(DEFAULT_PREFS.autoplay);

  // hydrate from storage
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem("@prefs");
        if (raw) {
          const saved = JSON.parse(raw);
          if (saved.indexLang && INDEX_LANGS.includes(saved.indexLang)) setIndexLang(saved.indexLang);
          if (typeof saved.autoplay === "boolean") setAutoplay(saved.autoplay);
        }
      } catch {}
    })();
  }, []);

  // persist
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem("@prefs", JSON.stringify({ indexLang, autoplay }));
      } catch {}
    })();
  }, [indexLang, autoplay]);

  // guard: if list changes, snap to first
  useEffect(() => {
    if (!INDEX_LANGS.includes(indexLang)) setIndexLang(INDEX_LANGS[0]);
  }, [indexLang]);

  const value = useMemo(
    () => ({ indexLang, setIndexLang, autoplay, setAutoplay }),
    [indexLang, autoplay]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePrefs() {
  return useContext(Ctx);
}
