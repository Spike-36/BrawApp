import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from './colors';

export default function WordRecordLayout({ block, onPlayAudio, onPlayContextAudio }) {
  if (!block) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPlayAudio}>
        <Text style={styles.mainText}>{block.scottish}</Text>
      </TouchableOpacity>

      <Text style={styles.phonetic}>{block.phonetic}</Text>

      <Text style={styles.meaning}>{block.meaning}</Text>

      <TouchableOpacity onPress={onPlayContextAudio}>
        <Text style={styles.context}>{block.context}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    paddingHorizontal: 24,
  },
  mainText: {
    fontSize: 65,
    color: colors.textPrimary,
    fontWeight: '500',
     textAlign: 'left', // 👈 Add this line
  alignSelf: 'flex-start', // 👈 Ensures the text aligns within its container
    marginBottom: 16,
  },
  phonetic: {
    fontSize: 20,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  meaning: {
    fontSize: 20,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  context: {
    fontSize: 18,
    color: '#444',
    textAlign: 'center',
    paddingHorizontal: 0,
    marginBottom: 20,
  },
});
