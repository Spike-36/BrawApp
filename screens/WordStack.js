// screens/WordStack.js
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WordRecordScreen from './WordRecordScreen';
import WordStartScreen from './WordStartScreen';

const Stack = createNativeStackNavigator();

export default function WordStack() {
  return (
    <Stack.Navigator
      initialRouteName="WordStart" // ✅ this line is CRUCIAL
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="WordStart" component={WordStartScreen} />
      <Stack.Screen name="WordRecord" component={WordRecordScreen} />
    </Stack.Navigator>
  );
}
