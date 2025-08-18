// screens/SettingsScreen.js
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView, StyleSheet, Switch, Text, View } from 'react-native';
import { INDEX_LANGS, usePrefs } from '../context/PrefsContext';
import { isRTL as rtlCheck, t } from '../i18n';

// Display labels for the picker
const LANG_LABELS = {
  English: 'English',
  French: 'French',
  Japanese: 'Japanese',
  Arabic: 'Arabic',
};

// Map the selected display name -> i18n code
const CODE_MAP = {
  English: 'en',
  French: 'fr',
  Japanese: 'ja',
  Arabic: 'ar',
};

export default function SettingsScreen() {
  const { indexLang, setIndexLang, autoplay, setAutoplay } = usePrefs();

  // Derive the language code the i18n helper expects
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

        <Text
          style={[
            styles.label,
            isRTL && { writingDirection: 'rtl', textAlign: 'right' },
          ]}
        >
          {t('language', uiLangCode)}
        </Text>

        <View style={styles.pickerWrap}>
          <Picker
            selectedValue={indexLang}             // keep storing the display name
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

  pickerWrap: {
    backgroundColor: '#F2F4F7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    overflow: 'hidden',
  },

  row: {
    marginTop: 16,
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
