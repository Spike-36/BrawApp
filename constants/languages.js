// constants/languages.js
export const VISIBLE_INDEX_LANGS = [
  'English',
  'French',
  'Spanish',
  'German',
  'Arabic',
  'Japanese',
  'Korean',
];

// Codes used for i18n + RTL checks
export const CODE_MAP = {
  English: 'en',
  French:  'fr',
  Spanish: 'es',
  German:  'de',
  Italian: 'it',   // kept here for later
  Arabic:  'ar',
  Japanese:'ja',
  Korean:  'ko',
  Chinese: 'zh',   // kept here for later
};

// Small helpers
export const labelToCode = (label) => CODE_MAP[label] || 'en';
export const codeToLabel = (code) =>
  Object.keys(CODE_MAP).find((k) => CODE_MAP[k] === code) || 'English';

export const isAllowedLabel = (label) => VISIBLE_INDEX_LANGS.includes(label);
