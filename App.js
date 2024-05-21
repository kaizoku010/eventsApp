import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Platform } from 'react-native'; // Import Platform
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignupForm from './screens/Login';
import SuccessScreen from './screens/Home';
import MyTabs from './Operations/MyTabs';
import HomeScreen from './screens/HomeScreen';
import PendingRequests from './screens/PendingRequests';
import ChatRoom from './screens/ChatRoom';
import NewLogin from './screens/NewLogin';
import { Provider } from 'react-redux';
import store from './stateManagment/store'; // Import your Redux store
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import PostDetails from './screens/PostDetails';
import { EventsDataProvider } from './stateManagment/ContextApi';

const Stack = createStackNavigator();


export default function App() {

  return (
    <EventsDataProvider>

    <GestureHandlerRootView style={{ flex: 1 }}>
    <Provider store={store}>
       <NavigationContainer>
    <Stack.Navigator initialRouteName="SignupForm">
      <Stack.Screen options={{headerShown:false}} name="Moxie5 Events"  component={NewLogin} />
      <Stack.Screen options={{headerShown:false}} name="Login"  component={SignupForm} />
      <Stack.Screen options={{headerShown:false}}  name="HomeTabs" component={MyTabs} />
      <Stack.Screen  name="PostDetails" component={PostDetails} />

      <Stack.Screen name="requests" component={PendingRequests} />
      <Stack.Screen name="ChatRoom" component={ChatRoom} />
    </Stack.Navigator>
  </NavigationContainer>
    </Provider>
    
    </GestureHandlerRootView>
</EventsDataProvider>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
