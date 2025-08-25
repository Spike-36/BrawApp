// components/WordRecordLayout.js
import { Feather } from '@expo/vector-icons';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CODE_MAP } from '../constants/languages';
import { usePrefs } from '../context/PrefsContext';
import { tGrammar } from '../i18n/grammar';
import { pickInfo } from '../utils/langPickers';
import colors from './colors';

const norm = (v) => (typeof v === 'string' ? v.trim() : '');
const ICON_SIZE = 28;
const ICON_COLOR = '#888';

export default function WordRecordLayout({
  block,
  meaning,
  englishContext,
  altContext,
  onPlayAudio,
  onPlayContextAudio,
}) {
  if (!block) return null;

  const { indexLang } = usePrefs();                     // ✅ no fallback shim
  const uiLangCode = CODE_MAP[indexLang] || 'en';       // ✅ map label→code for i18n

  const shownIPA = norm(block?.ipa || '');
  const shownPhonetic = norm(block?.phonetic || '');
  const shownMeaning = typeof meaning === 'string' ? meaning : norm(block?.meaning || '');
  const grammarLabel = block?.grammarType ? tGrammar(block.grammarType, uiLangCode) : ''; // ✅ localized
  const infoText = useMemo(() => pickInfo(block, indexLang), [block, indexLang]);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Scottish word + speaker */}
      {!!block?.scottish && (
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onPlayAudio} accessibilityRole="button" style={{ flexShrink: 1 }}>
            <Text style={styles.mainText}>{block.scottish}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onPlayAudio}
            accessibilityRole="button"
            accessibilityLabel="Play word audio"
            activeOpacity={0.6}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.iconBtn}
          >
            <Feather name="volume-2" size={ICON_SIZE} color={ICON_COLOR} />
          </TouchableOpacity>
        </View>
      )}

      {/* IPA + Grammar */}
      {(shownIPA || grammarLabel) && (
        <View style={styles.inlineRow}>
          {shownIPA ? <Text style={styles.ipa}>{shownIPA}</Text> : <View />}
          {grammarLabel ? <Text style={styles.grammar}>{grammarLabel}</Text> : <View />}
        </View>
      )}

      {/* Phonetic */}
      {!!shownPhonetic && <Text style={styles.phonetic}>{shownPhonetic}</Text>}

      {/* Divider */}
      {(shownIPA || shownPhonetic) && <View style={styles.divider} />}

      {/* Meaning */}
      {!!shownMeaning && <Text style={styles.meaning}>{shownMeaning}</Text>}

      {/* English context + speaker */}
      {!!englishContext && (
        <View style={styles.contextRow}>
          <TouchableOpacity onPress={onPlayContextAudio} accessibilityRole="button" style={{ flexShrink: 1 }}>
            <Text style={styles.contextEN}>{englishContext}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onPlayContextAudio}
            accessibilityRole="button"
            accessibilityLabel="Play context audio"
            activeOpacity={0.6}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.iconBtn}
          >
            <Feather name="volume-2" size={ICON_SIZE} color={ICON_COLOR} />
          </TouchableOpacity>
        </View>
      )}

      {/* Alt context */}
      {!!altContext && <Text style={styles.contextAlt}>{altContext}</Text>}

      {/* Info */}
      {!!infoText && <Text style={styles.infoInline}>{infoText}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 120,
  },

  headerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainText: {
    fontSize: 50,
    color: colors.textPrimary,
    fontWeight: '500',
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginBottom: 16,
    fontFamily: 'LibreBaskerville_700Bold',
  },
  iconBtn: {
    marginLeft: 12,
    marginBottom: 16,
  },

  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  ipa: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'left',
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
  },
  phonetic: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'left',
    marginBottom: 8,
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
  },
  grammar: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'right',
    fontFamily: 'PlayfairDisplay_400Regular',
  },

  divider: {
    height: 1.5,
    backgroundColor: '#BBBBBB',
    width: '100%',
    marginVertical: 12,
    borderRadius: 1,
  },

  meaning: {
    fontSize: 20,
    color: colors.textSecondary,
    textAlign: 'left',
    marginBottom: 20,
    fontFamily: 'PlayfairDisplay_700Bold',
  },

  contextRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  contextEN: {
    fontSize: 18,
    color: '#333',
    textAlign: 'left',
    marginBottom: 6,
    fontFamily: 'PlayfairDisplay_400Regular',
  },
  contextAlt: {
    fontSize: 18,
    color: '#6b6b6b',
    textAlign: 'left',
    marginTop: 12,
    marginBottom: 20,
    fontFamily: 'PlayfairDisplay_400Regular',
  },

  infoInline: {
    fontSize: 18,
    lineHeight: 27,
    color: '#555',
    marginTop: 16,
    marginBottom: 30,
    fontFamily: 'PlayfairDisplay_400Regular',
  },
});
