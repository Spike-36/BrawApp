import blocks from '../data/blocks.json';
import WordScreen from './WordScreen';

export default function WordTabScreen() {
  return <WordScreen route={{ params: { words: blocks, index: 0 } }} />;
}
