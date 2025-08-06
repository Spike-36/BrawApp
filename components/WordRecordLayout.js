import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WordRecordLayout({
  block,
  onPlayAudio = () => {},
  onShowTip = () => {},
}) {
  if (!block) return null;

  return (
    <View style={styles.container}>
      {/* 🟡 Scottish */}
      <Text style={styles.scottish}>{block?.scottish}</Text>

      {/* 🟣 Phonetic */}
      <Text style={styles.phonetic}>{block?.phonetic}</Text>

      {/* ⚪ English (tap to play audio) */}
      <TouchableOpacity onPress={onPlayAudio}>
        <Text style={styles.english}>{block?.english}</Text>
      </TouchableOpacity>

      {/* 🟠 Tip icon */}
      {block?.tip ? (
        <TouchableOpacity onPress={onShowTip}>
          <Text style={styles.tipIcon}>💡</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  scottish: {
    fontSize: 36,
    color: '#2E2E2E', // charcoal
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  phonetic: {
    fontSize: 20,
    color: '#555', // dark grey
    marginBottom: 30,
    textAlign: 'center',
  },
  english: {
    fontSize: 40,
    color: '#2E2E2E',
    textAlign: 'center',
    marginBottom: 20,
  },
  tipIcon: {
    fontSize: 28,
    color: '#FFD700',
    marginTop: 20,
  },
});
