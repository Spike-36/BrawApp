// screens/WordStack.js
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import blocks from '../data/blocks.json';
import WordScreen from './WordScreen'; // ✅ Correct, current screen

const Stack = createNativeStackNavigator();

export default function WordStack() {
  return (
    <Stack.Navigator
      initialRouteName="Word"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="Word"
        component={WordScreen}
        initialParams={{
          words: blocks,
          index: 0,
        }}
      />
    </Stack.Navigator>
  );
}
