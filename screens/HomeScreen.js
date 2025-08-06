import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Braw!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF8', // light warm off-white
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#2E2E2E', // charcoal
    fontSize: 24,
    fontWeight: '600',
  },
});
