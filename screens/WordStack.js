// screens/WordStack.js
import { createStackNavigator } from '@react-navigation/stack';
import blocks from '../data/blocks.json';
import WordScreen from './WordScreen';

const Stack = createStackNavigator();

export default function WordStack() {
  return (
    <Stack.Navigator
      initialRouteName="Word"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'black' },
      }}
    >
      <Stack.Screen
        name="Word"
        component={WordScreen}
        initialParams={{ words: blocks, index: 0 }}
      />
    </Stack.Navigator>
  );
}
