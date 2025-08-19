// screens/SettingsScreen.js
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView, StyleSheet, Switch, Text, View } from 'react-native';
import { INDEX_LANGS, usePrefs } from '../context/PrefsContext';
import { isRTL as rtlCheck, t } from '../i18n';

const LANG_LABELS = {
  English: 'English',
  French: 'French',
  Japanese: 'Japanese',
  Arabic: 'Arabic',
};

const CODE_MAP = {
  English: 'en',
  French: 'fr',
  Japanese: 'ja',
  Arabic: 'ar',
};

export default function SettingsScreen() {
  const { indexLang, setIndexLang, autoplay, setAutoplay } = usePrefs();

  const uiLangCode = CODE_MAP[indexLang] || 'en';
  const isRTL = rtlCheck(uiLangCode);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text
          style={[
            styles.heading,
            isRTL && { writingDirection: 'rtl', textAlign: 'right' },
          ]}
        >
          {t('settings', uiLangCode)}
        </Text>

        {/* Language heading */}
        <Text
          style={[
            styles.sectionHeading,
            isRTL && { writingDirection: 'rtl', textAlign: 'right' },
          ]}
        >
          {t('language', uiLangCode)}
        </Text>

        {/* Language picker */}
        <View style={styles.pickerWrap}>
          <Picker
            selectedValue={indexLang}
            onValueChange={(val) => setIndexLang(val)}
            dropdownIconColor="#111"
          >
            {INDEX_LANGS.map((name) => (
              <Picker.Item
                key={name}
                label={LANG_LABELS[name] ?? name}
                value={name}
                color="#111"
              />
            ))}
          </Picker>
        </View>

        {/* Audio heading */}
        <Text
          style={[
            styles.audioHeading,
            isRTL && { writingDirection: 'rtl', textAlign: 'right' },
          ]}
        >
          {t('audio', uiLangCode)}
        </Text>

        {/* Autoplay toggle */}
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.label,
                isRTL && { writingDirection: 'rtl', textAlign: 'right' },
              ]}
            >
              {t('autoplay', uiLangCode)}
            </Text>
            <Text
              style={[
                styles.help,
                isRTL && { writingDirection: 'rtl', textAlign: 'right' },
              ]}
            >
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

  sectionHeading: {
    color: '#222',
    fontSize: 18,
    marginTop: 24,
    fontWeight: '600',
  },

  audioHeading: {
    color: '#222',
    fontSize: 18,
    marginTop: 32, // pushed further down from Language
    fontWeight: '600',
  },

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
