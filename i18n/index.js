// i18n/index.js
import ar from './ar.json';
import de from './de.json';
import en from './en.json';
import es from './es.json';
import fr from './fr.json';
import it from './it.json';
import ja from './ja.json';
import ko from './ko.json';
import zh from './zh.json';

import { CODE_MAP } from '../constants/languages';

const RESOURCES = { en, fr, ja, ar, es, de, it, ko, zh };
const RTL_LANGS = new Set(['ar']);

function normalizeLang(lang) {
  if (!lang) return 'en';
  const raw = String(lang).trim();

  // exact code match
  if (RESOURCES[raw]) return raw;

  // label → code (e.g., "Italian" → "it")
  const fromLabel = CODE_MAP[raw];
  if (fromLabel && RESOURCES[fromLabel]) return fromLabel;

  // regional -> base (e.g., "it-IT" → "it", "zh-CN" → "zh")
  const base = raw.toLowerCase().split('-')[0];
  if (RESOURCES[base]) return base;

  return 'en';
}

export function t(key, lang = 'en') {
  const code = normalizeLang(lang);
  const dict = RESOURCES[code] || RESOURCES.en;
  return dict?.[key] ?? RESOURCES.en?.[key] ?? key;
}

export function isRTL(lang = 'en') {
  return RTL_LANGS.has(normalizeLang(lang));
}

// One-time debug so you know what’s loaded
console.log('[i18n] loaded languages:', Object.keys(RESOURCES));
