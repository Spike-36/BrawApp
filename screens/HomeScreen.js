// screens/HomeScreen.js
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePrefs } from '../context/PrefsContext';
import { isRTL as rtlCheck } from '../i18n';

const BLUE = '#016FCC';
const CARD_WIDTH = '86%';
const HERO_TOP_SPACING = 150;
const BUTTON_WIDTH = '72%';
const BUTTON_RADIUS = 28;

const CODE_MAP = { English: 'en', French: 'fr', Japanese: 'ja', Arabic: 'ar' };

export default function HomeScreen({ navigation }) {
  const { indexLang, autoplay } = usePrefs();
  const uiLangCode = CODE_MAP[indexLang] || 'en';
  const isRTL = rtlCheck(uiLangCode);

  return (
    <ImageBackground source={require('../assets/images/brawHome.jpg')} style={styles.bg} resizeMode="cover">
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* HERO PANEL */}
        <View style={styles.heroWrap}>
          <View style={styles.heroCard}>
            <Text style={styles.heroTitle}>Braw!</Text>
            <Text style={styles.heroSubtitle}>scotspeak</Text>
          </View>
        </View>

        {/* BUTTONS */}
        <View style={styles.buttons}>
          {/* Top button — language */}
          <Pressable
            style={[styles.btn, styles.btnPrimary, styles.btnSpacing]}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={[styles.btnText, isRTL && { writingDirection: 'rtl', textAlign: 'center' }]}>
              {indexLang}
            </Text>
          </Pressable>

          {/* Bottom button — autoplay status */}
          <Pressable
            style={[
              styles.btn,
              autoplay ? styles.btnPrimary : styles.btnDisabled, // highlight if on
            ]}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text
              style={[
                styles.btnText,
                !autoplay && { opacity: 0.5 }, // dim text if off
                isRTL && { writingDirection: 'rtl', textAlign: 'center' },
              ]}
            >
              Audio Autoplay: {autoplay ? 'On' : 'Off'}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safe: { flex: 1, backgroundColor: 'transparent' },

  /* --- HERO --- */
  heroWrap: {
    alignItems: 'center',
    marginTop: HERO_TOP_SPACING,
  },
  heroCard: {
    width: CARD_WIDTH,
    backgroundColor: BLUE,
    borderRadius: 12,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 54,
    lineHeight: 56,
    fontFamily: 'LibreBaskerville_700Bold',
  },
  heroSubtitle: {
    color: '#fff',
    marginTop: 12,
    fontSize: 26,
    letterSpacing: 3,
    fontFamily: 'PlayfairDisplay_400Regular',
  },

  /* --- BUTTONS --- */
  buttons: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    width: BUTTON_WIDTH,
    paddingVertical: 14,
    borderRadius: BUTTON_RADIUS,
    alignItems: 'center',
  },
  btnSpacing: {
    marginBottom: 48, // space between language & autoplay
  },
  btnPrimary: { backgroundColor: 'rgba(0, 51, 102, 0.75)' },
  btnDisabled: { backgroundColor: 'rgba(0, 51, 102, 0.35)' },

  btnText: {
    color: '#EAF2FF',
    fontSize: 20,
    letterSpacing: 2,
    fontFamily: 'PlayfairDisplay_400Regular',
  },
});
