// screens/HomeScreen.tsx
import { useNavigation } from '@react-navigation/native';
import { ImageBackground, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const nav = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground
        source={require('../assets/images/brawHome.jpeg')} // static require = bundled
        style={styles.bg}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safe}>
          {/* dark overlay for readability */}
          <View style={styles.overlay} />

          {/* Optional headline / CTA */}
          {/* <Text style={styles.title}>Braw</Text> */}

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.btn} onPress={() => nav.navigate('List')}>
              <Text style={styles.btnText}>Browse Words</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnGhost]} onPress={() => nav.navigate('Settings')}>
              <Text style={styles.btnText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safe: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', padding: 16 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)', // tweak as needed
  },
  title: {
    position: 'absolute', top: 80, alignSelf: 'center',
    color: '#fff', fontSize: 42, fontWeight: '800', letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.4)', textShadowRadius: 6,
  },
  buttons: { width: '100%', gap: 12, marginBottom: 12 },
  btn: {
    backgroundColor: 'rgba(0,0,0,0.6)', paddingVertical: 14, borderRadius: 10,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
  },
  btnGhost: { backgroundColor: 'rgba(0,0,0,0.35)' },
  btnText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
