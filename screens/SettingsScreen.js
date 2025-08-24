// screens/SettingsScreen.js
import { Picker } from '@react-native-picker/picker';
import { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Switch, Text, View } from 'react-native';
import { CODE_MAP, VISIBLE_INDEX_LANGS } from '../constants/languages'; // <- single source of truth
import { usePrefs } from '../context/PrefsContext';
import { isRTL as rtlCheck, t } from '../i18n';

// Display labels (right now identical, but easy to localize later)
const LANG_LABELS = Object.fromEntries(VISIBLE_INDEX_LANGS.map(n => [n, n]));

// Your i18n folder currently has en/fr/ja/ar. Others fallback to en.
const LOCALIZED_CODES = new Set(['en', 'fr', 'ja', 'ar']);

export default function SettingsScreen() {
  const { indexLang, setIndexLang, autoplay, setAutoplay } = usePrefs();

  // Clamp stored value to allowed set
  useEffect(() => {
    if (!VISIBLE_INDEX_LANGS.includes(indexLang)) {
      setIndexLang(VISIBLE_INDEX_LANGS[0] || 'English');
    }
  }, [indexLang, setIndexLang]);

  const effectiveIndexLang =
    VISIBLE_INDEX_LANGS.includes(indexLang) ? indexLang : (VISIBLE_INDEX_LANGS[0] || 'English');

  const candidateCode = CODE_MAP[effectiveIndexLang] || 'en';
  const uiLangCode = LOCALIZED_CODES.has(candidateCode) ? candidateCode : 'en';
  const isRTL = rtlCheck(uiLangCode);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={[styles.heading, isRTL && { writingDirection: 'rtl', textAlign: 'right' }]}>
          {t('settings', uiLangCode)}
        </Text>

        <Text style={[styles.sectionHeading, isRTL && { writingDirection: 'rtl', textAlign: 'right' }]}>
          {t('language', uiLangCode)}
        </Text>

        <View style={styles.pickerWrap}>
          <Picker
            selectedValue={effectiveIndexLang}
            onValueChange={(val) => setIndexLang(val)}
            dropdownIconColor="#111"
          >
            {VISIBLE_INDEX_LANGS.map((name) => (
              <Picker.Item key={name} label={LANG_LABELS[name]} value={name} color="#111" />
            ))}
          </Picker>
        </View>

        <Text style={[styles.audioHeading, isRTL && { writingDirection: 'rtl', textAlign: 'right' }]}>
          {t('audio', uiLangCode)}
        </Text>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, isRTL && { writingDirection: 'rtl', textAlign: 'right' }]}>
              {t('autoplay', uiLangCode)}
            </Text>
            <Text style={[styles.help, isRTL && { writingDirection: 'rtl', textAlign: 'right' }]}>
              {t('autoplay_description', uiLangCode)}
            </Text>
          </View>
          <Switch
            value={autoplay}
            onValueChange={setAutoplay}
            trackColor={{ false: '#D0D5DD', true: '#6B8CC8' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, padding: 20, gap: 16, backgroundColor: '#FFFFFF' },

  heading: { color: '#111', fontSize: 28, fontWeight: '800', marginBottom: 8 },
  label: { color: '#222', fontSize: 16, marginTop: 8 },
  help: { color: '#667085', fontSize: 13, marginTop: 4 },

  sectionHeading: { color: '#222', fontSize: 18, marginTop: 24, fontWeight: '600' },
  audioHeading: { color: '#222', fontSize: 18, marginTop: 32, fontWeight: '600' },

  pickerWrap: {
    backgroundColor: '#F2F4F7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    overflow: 'hidden',
  },

  row: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F2F4F7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
