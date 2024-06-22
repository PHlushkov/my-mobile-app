import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../../Screens/HomeScreen';
import AuthorizationScreen from '../../Screens/AuthorizationScreen';
import AddPostScreen from '../../Screens/AddPostScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AuthorizationScreen" component={AuthorizationScreen} />
        <Stack.Screen name="AddPostScreen" component={AddPostScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
