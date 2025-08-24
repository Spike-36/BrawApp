// utils/langPickers.js
import { CODE_MAP } from '../constants/languages';

const norm = (s) => (typeof s === 'string' ? s.trim() : '');

// ---- Meaning ----
export function pickMeaning(entry, lang = 'English') {
  if (!entry) return '';
  // English lives in "meaning" (FileMaker export); allow "English" as a fallback alias just in case
  if (lang === 'English') return norm(entry.meaning ?? entry.English);

  // Direct top-level key, e.g., entry["French"], entry["Chinese"], etc.
  const direct = entry[lang];
  if (norm(direct)) return direct;

  // Legacy nested shape fallback: meaning: { en, fr, ja, ar, ... }
  const code = CODE_MAP[lang];
  if (entry.meaning && typeof entry.meaning === 'object' && code) {
    return norm(entry.meaning[code] ?? entry.meaning.en);
  }

  // Last resort: return English meaning if present
  return norm(entry.meaning);
}

// ---- Context ----
export function pickContext(entry, lang = 'English') {
  if (!entry) return '';
  if (lang === 'English') return norm(entry.English_Context ?? entry.context);

  const key = `${lang}_Context`; // e.g. "French_Context"
  if (norm(entry[key])) return entry[key];

  // Legacy nested shape: context: { fr, ja, ... }
  const code = CODE_MAP[lang];
  if (entry.context && typeof entry.context === 'object' && code) {
    return norm(entry.context[code] ?? entry.context.en);
  }

  return norm(entry.English_Context ?? entry.context ?? '');
}

// ---- Info ----
export function pickInfo(entry, lang = 'English') {
  if (!entry) return '';
  if (lang === 'English') return norm(entry.English_Info);

  const key = `${lang}_Info`;
  if (norm(entry[key])) return entry[key];

  return norm(entry.English_Info ?? '');
}

// ---- Direction ----
export function writingDir(lang = 'English') {
  return lang === 'Arabic' ? 'rtl' : 'ltr';
}
