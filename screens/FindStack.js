// FindStack.js
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import FindWordRecord from './FindWordRecord';
import VoiceSearchScreen from './VoiceSearchScreen';

const Stack = createStackNavigator();

export default function FindStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        // JS stack uses `cardStyle` (not `contentStyle`)
        cardStyle: { backgroundColor: 'black' },
        // approximate a simple fade transition
        animationEnabled: true,
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
      }}
    >
      <Stack.Screen name="VoiceSearch" component={VoiceSearchScreen} />
      <Stack.Screen name="FindWordRecord" component={FindWordRecord} />
    </Stack.Navigator>
  );
}
