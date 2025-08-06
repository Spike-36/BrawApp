// screens/ExploreScreenSimple.js
import { FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import blocks from '../data/blocks.json';

const ExploreScreenSimple = ({ navigation }) => {
  const handlePress = (index) => {
    navigation.navigate('Word', { index, words: blocks });
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity style={styles.item} onPress={() => handlePress(index)}>
      <Text style={styles.english}>{item.english}</Text>
      <Text style={styles.foreign}>{item.japanese}</Text>
      <Text style={styles.phonetic}>{item.japanesePhonetic}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={blocks}
      keyExtractor={(item, index) => item.code || index.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  item: {
    marginBottom: 20,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  english: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  foreign: {
    fontSize: 16,
    marginTop: 4,
  },
  phonetic: {
    fontSize: 14,
    marginTop: 2,
    color: '#666',
  },
});

export default ExploreScreenSimple;
