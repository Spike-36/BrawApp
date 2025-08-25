// screens/SettingsScreen.js
import { Picker } from '@react-native-picker/picker';
import { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Switch, Text, View } from 'react-native';
import { CODE_MAP, VISIBLE_INDEX_LANGS } from '../constants/languages';
import { usePrefs } from '../context/PrefsContext';
import { isRTL, t } from '../i18n';

// ✅ Expanded labels so users see both native + English
const LANG_LABELS = {
  English: 'English',
  French: 'Français (French)',
  Spanish: 'Español (Spanish)',
  German: 'Deutsch (German)',
  Arabic: 'العربية (Arabic)',
  Japanese: '日本語 (Japanese)',
  Korean: '한국어 (Korean)',
  // Chinese & Italian hidden for now
};

export default function SettingsScreen() {
  const { indexLang, setIndexLang, autoplay, setAutoplay } = usePrefs();

  // Clamp stored value
  useEffect(() => {
    if (!VISIBLE_INDEX_LANGS.includes(indexLang)) {
      setIndexLang(VISIBLE_INDEX_LANGS[0] || 'English');
    }
  }, [indexLang, setIndexLang]);

  const effectiveIndexLang =
    VISIBLE_INDEX_LANGS.includes(indexLang) ? indexLang : (VISIBLE_INDEX_LANGS[0] || 'English');

  const code = CODE_MAP[effectiveIndexLang] || 'en';
  const rtl = isRTL(effectiveIndexLang);
  const dirStyle = rtl ? { writingDirection: 'rtl', textAlign: 'right' } : null;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={[styles.heading, dirStyle]}>
          {t('settings', effectiveIndexLang)}
        </Text>

        <Text style={[styles.sectionHeading, dirStyle]}>
          {t('language', effectiveIndexLang)}
        </Text>

        <View style={styles.pickerWrap}>
          <Picker
            selectedValue={effectiveIndexLang}
            onValueChange={(val) => setIndexLang(val)}
            dropdownIconColor="#111"
          >
            {VISIBLE_INDEX_LANGS.map((name) => (
              <Picker.Item
                key={name}
                label={LANG_LABELS[name] || name}
                value={name}
                color="#111"
              />
            ))}
          </Picker>
        </View>

        <Text style={[styles.audioHeading, dirStyle]}>
          {t('audio', effectiveIndexLang)}
        </Text>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, dirStyle]}>
              {t('autoplay', effectiveIndexLang)}
            </Text>
            <Text style={[styles.help, dirStyle]}>
              {t('autoplay_description', effectiveIndexLang)}
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
