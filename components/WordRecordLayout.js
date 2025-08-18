// components/WordRecordLayout.js
import { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { usePrefs } from '../context/PrefsContext';
import { tGrammar } from '../i18n/grammar';
import { pickInfo } from '../utils/langPickers';
import colors from './colors';

// Helper to safely read strings
const norm = (v) => (typeof v === 'string' ? v.trim() : '');
const has = (obj, k) => obj && Object.prototype.hasOwnProperty.call(obj, k);

// Optional legacy code map (only used for deep-nested fallbacks)
const CODE_MAP = { English: 'en', French: 'fr', Japanese: 'ja', Arabic: 'ar' };

export default function WordRecordLayout({
  block,
  meaning,
  onPlayAudio,
  onPlayContextAudio,
}) {
  if (!block) return null;

  const { indexLang } = usePrefs ? usePrefs() : { indexLang: 'English' };

  // ==== Meaning ====
  const shownMeaning =
    typeof meaning === 'string'
      ? meaning
      : norm(block?.meaning);

  // ==== English Context (primary, tappable) ====
  const englishContext =
    norm(block?.English_Context) ||
    norm(block?.contextEnglish) ||
    (block?.context && typeof block.context === 'object' ? norm(block.context.en) : '') ||
    norm(block?.context) ||
    '';

  // ==== Foreign Context (secondary, under English, non-tappable) ====
  let altContext = '';
  if (indexLang && indexLang !== 'English') {
    const flatKey = `${indexLang}_Context`; // e.g., "French_Context"
    if (has(block, flatKey)) {
      altContext = norm(block[flatKey]);
    }
    if (!altContext && block?.context && typeof block.context === 'object') {
      const code = CODE_MAP[indexLang];
      if (code && has(block.context, code)) {
        altContext = norm(block.context[code]);
      }
    }
    if (!altContext) {
      const legacyFM = `Scottish_${indexLang}Context`;
      if (has(block, legacyFM)) {
        altContext = norm(block[legacyFM]);
      }
    }
  }

  const grammarLabel = block?.grammarType
    ? tGrammar(block.grammarType, (CODE_MAP[indexLang] ?? 'en'))
    : '';

  // IPA
  const shownIPA = norm(block?.ipa);

  // RTL for Arabic alt context only
  const altIsRTL = indexLang === 'Arabic';

  // ==== Info (per-language) ====
  const infoText = pickInfo(block, indexLang);
  const infoRTL = indexLang === 'Arabic';
  const [showInfo, setShowInfo] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header row: Scottish word + Info button */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onPlayAudio} accessibilityRole="button">
          <Text style={styles.mainText}>{block.scottish}</Text>
        </TouchableOpacity>

        {/* Minimal “i” info badge */}
        <TouchableOpacity
          onPress={() => setShowInfo(true)}
          accessibilityRole="button"
          accessibilityLabel="Show info"
          style={styles.infoBtn}
        >
          <Text style={styles.infoGlyph}>i</Text>
        </TouchableOpacity>
      </View>

      {!!block?.phonetic && (
        <Text style={styles.phonetic}>{block.phonetic}</Text>
      )}

      {!!shownIPA && (
        <Text style={styles.ipa} accessibilityLabel="IPA pronunciation">
          {shownIPA}
        </Text>
      )}

      {!!grammarLabel && <Text style={styles.grammar}>{grammarLabel}</Text>}

      {!!shownMeaning && <Text style={styles.meaning}>{shownMeaning}</Text>}

      {/* English context — always shown, tappable for audio */}
      {!!englishContext && (
        <TouchableOpacity onPress={onPlayContextAudio} accessibilityRole="button">
          <Text style={styles.contextEN}>{englishContext}</Text>
        </TouchableOpacity>
      )}

      {/* Foreign/Index-language context — directly beneath English (non-tappable) */}
      {!!altContext && (
        <Text
          style={[
            styles.contextAlt,
            altIsRTL && { writingDirection: 'rtl', textAlign: 'right' },
          ]}
        >
          {altContext}
        </Text>
      )}

      {/* Info bottom sheet */}
      <Modal visible={!!showInfo} animationType="slide" transparent onRequestClose={() => setShowInfo(false)}>
        <View style={styles.sheetBackdrop}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Info</Text>
            <Text
              style={[
                styles.sheetText,
                infoRTL && { writingDirection: 'rtl', textAlign: 'right' },
              ]}
            >
              {infoText || 'No extra info available.'}
            </Text>
            <TouchableOpacity onPress={() => setShowInfo(false)} style={styles.sheetClose}>
              <Text style={styles.sheetCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'flex-start', paddingHorizontal: 24 },
  headerRow: { width: '100%', flexDirection: 'row', alignItems: 'center' },
  mainText: {
    fontSize: 65,
    color: colors.textPrimary,
    fontWeight: '500',
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginBottom: 16,
    fontFamily: 'LibreBaskerville_700Bold', // Scottish word headline
  },
  infoBtn: {
    marginLeft: 'auto',
    padding: 6,
    borderRadius: 16,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 16,
  },
  infoGlyph: {
    color: '#bbb',
    fontSize: 16,
    fontWeight: '600',
    width: 18,
    textAlign: 'center',
  },
  phonetic: {
    fontSize: 20,
    color: colors.textSecondary,
    textAlign: 'left',
    marginBottom: 8,
    fontFamily: 'LibreBaskerville_400Regular',
  },
  ipa: {
    fontSize: 20,
    color: colors.textSecondary,
    textAlign: 'left',
    marginBottom: 12,
    fontFamily: 'LibreBaskerville_400Regular',
  },
  grammar: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'left',
    marginBottom: 12,
    fontFamily: 'LibreBaskerville_400Regular',
  },
  meaning: {
    fontSize: 22,
    color: colors.textSecondary,
    textAlign: 'left',
    marginBottom: 20,
    fontFamily: 'PlayfairDisplay_400Regular', // definition uses Playfair
  },
  contextEN: {
    fontSize: 18,
    color: '#333',
    textAlign: 'left',
    marginBottom: 6,
    fontFamily: 'LibreBaskerville_400Regular',
  },
  contextAlt: {
    fontSize: 17,
    color: '#6b6b6b',
    textAlign: 'left',
    marginBottom: 20,
    fontFamily: 'LibreBaskerville_400Regular',
  },
  // Bottom sheet styles
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#111',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  sheetTitle: { color: '#fff', fontSize: 18, marginBottom: 10, fontFamily: 'PlayfairDisplay_700Bold' },
  sheetText: { color: '#ccc', fontSize: 16, lineHeight: 22, fontFamily: 'PlayfairDisplay_400Regular' },
  sheetClose: { marginTop: 16, alignSelf: 'flex-end' },
  sheetCloseText: { color: '#89CFF0', fontSize: 16, fontFamily: 'LibreBaskerville_400Regular' },
});
