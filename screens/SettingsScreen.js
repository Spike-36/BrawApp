// screens/SettingsScreen.js
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView, StyleSheet, Switch, Text, View } from 'react-native';
import { INDEX_LANGS, usePrefs } from '../context/PrefsContext';

const LANG_LABELS = {
  en: 'English',
  fr: 'French',
  de: 'German',
  es: 'Spanish',
  it: 'Italian',
  pt: 'Portuguese',
  zh: 'Chinese',
  ja: 'Japanese',
  ko: 'Korean',
  th: 'Thai',
  tr: 'Turkish',
  ar: 'Arabic',
};

export default function SettingsScreen() {
  const { indexLang, setIndexLang, autoplay, setAutoplay } = usePrefs();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.heading}>Settings</Text>

        <Text style={styles.label}>Index language</Text>
        <View style={styles.pickerWrap}>
          <Picker
            selectedValue={indexLang}
            onValueChange={(val) => setIndexLang(val)}
            dropdownIconColor="#111"   // visible on light bg (Android)
            // no Picker.style here — avoids iOS text disappearing
          >
            {INDEX_LANGS.map((code) => (
              <Picker.Item
                key={code}
                label={LANG_LABELS[code] ?? code.toUpperCase()}
                value={code}
                color="#111"            // force visible text on iOS & Android
              />
            ))}
          </Picker>
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Autoplay (Listen mode)</Text>
            <Text style={styles.help}>Automatically play audio and advance.</Text>
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
  // Light theme
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, padding: 20, gap: 16, backgroundColor: '#FFFFFF' },

  heading: { color: '#111', fontSize: 28, fontWeight: '800', marginBottom: 8 },
  label: { color: '#222', fontSize: 16, marginTop: 8 },
  help: { color: '#667085', fontSize: 13, marginTop: 4 },

  // Picker container (light)
  pickerWrap: {
    backgroundColor: '#F2F4F7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    overflow: 'hidden',
  },

  // Row card (light)
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
