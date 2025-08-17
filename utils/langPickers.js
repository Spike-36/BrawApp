const norm = (s) => (typeof s === 'string' ? s.trim() : '');

export function pickMeaning(entry, lang = "English") {
  if (!entry) return "";
  if (lang === "English") return norm(entry.meaning);
  if (entry[lang]) return norm(entry[lang]); // e.g. entry["French"]
  // legacy nested shape fallback
  if (entry.meaning && typeof entry.meaning === "object") {
    const map = { English: "en", French: "fr", Japanese: "ja", Arabic: "ar" };
    const code = map[lang];
    return norm(entry.meaning?.[code] ?? entry.meaning?.en ?? "");
  }
  return norm(entry.meaning);
}

export function pickContext(entry, lang = "English") {
  if (!entry) return "";
  if (lang === "English") return norm(entry.English_Context ?? entry.context);
  const key = `${lang}_Context`; // e.g., "French_Context"
  if (entry[key]) return norm(entry[key]);
  // legacy nested shape fallback
  if (entry.context && typeof entry.context === "object") {
    const map = { English: "en", French: "fr", Japanese: "ja", Arabic: "ar" };
    const code = map[lang];
    return norm(entry.context?.[code] ?? entry.context?.en ?? "");
  }
  return norm(entry.English_Context ?? entry.context ?? "");
}

export function pickInfo(entry, lang = "English") {
  if (!entry) return "";
  if (lang === "English") return norm(entry.English_Info);
  const key = `${lang}_Info`;
  if (entry[key]) return norm(entry[key]);
  return norm(entry.English_Info ?? "");
}

export function writingDir(lang = "English") {
  return lang === "Arabic" ? "rtl" : "ltr";
}
