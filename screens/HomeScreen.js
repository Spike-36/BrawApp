// screens/HomeScreen.js
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { usePrefs } from '../context/PrefsContext';
import blocks from '../data/blocks.json';
import { isRTL as rtlCheck, t } from '../i18n';

// Match SettingsScreen mapping
const CODE_MAP = {
  English: 'en',
  French: 'fr',
  Japanese: 'ja',
  Arabic: 'ar',
};

export default function HomeScreen({ navigation }) {
  const { indexLang } = usePrefs();
  const uiLangCode = CODE_MAP[indexLang] || 'en';
  const isRTL = rtlCheck(uiLangCode);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        {/* Fixed brand name — not translated */}
        <Text style={styles.title}>Braw</Text>

        <Pressable
          style={[styles.btn, styles.primary]}
          onPress={() =>
            navigation.navigate('Word', {
              screen: 'WordMain',
              params: { words: blocks, index: 0 },
            })
          }
        >
          <Text
            style={[
              styles.btnText,
              isRTL && { writingDirection: 'rtl', textAlign: 'center' },
            ]}
          >
            {t('start_word', uiLangCode)}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.btn, styles.secondary]}
          onPress={() => navigation.navigate('List', { screen: 'WordList' })}
        >
          <Text
            style={[
              styles.btnText,
              isRTL && { writingDirection: 'rtl', textAlign: 'center' },
            ]}
          >
            {t('open_list', uiLangCode)}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.btn, styles.tertiary]}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text
            style={[
              styles.btnText,
              isRTL && { writingDirection: 'rtl', textAlign: 'center' },
            ]}
          >
            {t('settings', uiLangCode)}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontFamily: 'LibreBaskerville_700Bold', // brand font
    marginBottom: 24,
  },
  btn: {
    width: '80%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primary: { backgroundColor: '#1e90ff' },
  secondary: { backgroundColor: '#6B8CC8' },
  tertiary: { backgroundColor: '#444' },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'LibreBaskerville_700Bold', // ensure consistent font
  },
});
