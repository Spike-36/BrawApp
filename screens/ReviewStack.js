// screens/ReviewStack.js
import { createStackNavigator } from '@react-navigation/stack';
import ReviewScreen from './ReviewScreen';
import ReviewWordScreen from './ReviewWordScreen';

const Stack = createStackNavigator();

export default function ReviewStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        // JS stack uses `cardStyle` instead of `contentStyle`
        cardStyle: { backgroundColor: 'black' },
      }}
    >
      <Stack.Screen name="ReviewMain" component={ReviewScreen} />
      <Stack.Screen name="ReviewWord" component={ReviewWordScreen} />
    </Stack.Navigator>
  );
}
