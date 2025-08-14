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
            dropdownIconColor="#fff"
          >
            {INDEX_LANGS.map((code) => (
              <Picker.Item
                key={code}
                label={LANG_LABELS[code] ?? code.toUpperCase()}
                value={code}
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
            trackColor={{ false: '#444', true: '#7FB77E' }}
            thumbColor="#fff"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0B0B0B' },
  container: { flex: 1, padding: 20, gap: 16 },
  heading: { color: '#fff', fontSize: 28, fontWeight: '800', marginBottom: 8 },
  label: { color: '#ddd', fontSize: 16, marginTop: 8 },
  pickerWrap: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2c2c2c',
    overflow: 'hidden',
  },
  row: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2c2c2c',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  help: { color: '#9aa0a6', fontSize: 13, marginTop: 4 },
});
