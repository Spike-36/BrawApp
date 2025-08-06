import { ImageBackground, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <ImageBackground
      source={require('../assets/images/brawHome.jpeg')}
      style={styles.container}
      resizeMode="cover"
    >
      {/* <Text style={styles.text}>Welcome to Braw!</Text> */}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF', // white text for contrast — change if needed
    fontSize: 28,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
