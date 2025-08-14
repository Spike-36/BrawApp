// screens/HomeScreen.js
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import blocks from '../data/blocks.json';

export default function HomeScreen({ navigation }) {
  const totalWords = Array.isArray(blocks) ? blocks.length : 0;

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.title}>Braw</Text>
        <Text style={styles.subtitle}>Words available: {totalWords}</Text>

        <Pressable
          style={[styles.btn, styles.primary]}
          onPress={() =>
            navigation.navigate('Word', {
              screen: 'WordMain',
              params: { words: blocks, index: 0 },
            })
          }
        >
          <Text style={styles.btnText}>Start Word</Text>
        </Pressable>

        <Pressable
          style={[styles.btn, styles.secondary]}
          onPress={() =>
            navigation.navigate('List', {
              screen: 'WordList',
            })
          }
        >
          <Text style={styles.btnText}>Open List</Text>
        </Pressable>

        <Pressable
          style={[styles.btn, styles.tertiary]}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.btnText}>Settings</Text>
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
  title: { color: '#fff', fontSize: 28, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: '#bbb', marginBottom: 24 },
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
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' }, // <-- fixed
});
