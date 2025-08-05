// screens/WordStartScreen.js
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import blocks from '../data/blocks.json';

export default function WordStartScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const index = 0;
    navigation.replace('WordRecord', {
      words: blocks,
      index,
      mode: 'explore',
    });
  }, []);

  return null;
}
