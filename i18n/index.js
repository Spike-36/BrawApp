import ar from './ar.json';
import en from './en.json';
import fr from './fr.json';
import ja from './ja.json';

const resources = { en, fr, ja, ar };
const RTL_LANGS = new Set(['ar']);

export function t(key, lang = 'en') {
  const dict = resources[lang] ?? en;
  return (dict[key] ?? en[key] ?? key);
}

export function isRTL(lang = 'en') {
  return RTL_LANGS.has(lang);
}
