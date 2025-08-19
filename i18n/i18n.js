import labels from '../data/uiLabels.json';

export function t(key, lang = 'en') {
  // If key exists in selected language → use it
  if (labels[lang] && labels[lang][key]) {
    return labels[lang][key];
  }
  // Otherwise → fallback to English
  return labels.en[key] || key;
}
