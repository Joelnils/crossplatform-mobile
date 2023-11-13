import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@rneui/base';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider, useSelector } from 'react-redux';
import UserList from './src/screens/UserList/UserList';
import { store } from './src/store/api/store'
import UserForm from './src/components/UserForm/UserForm'
import UserInfo from './src/screens/UserInfo/UserInfo';


const UserListStack = createNativeStackNavigator()

const UserListStackScreen = () => {
  return (
    <UserListStack.Navigator>
      <UserListStack.Screen name="UserList" component={UserList} />
      <UserListStack.Screen name="UserInfo" component={UserInfo} />
      <UserListStack.Screen name="UserForm" component={UserForm} />
    </UserListStack.Navigator>
  );
};

const NavigationWrapper = () => {
  const loggedInAs = useSelector((state: any) => state.auth.loggedInAs);

  return(
    <NavigationContainer>
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen name="UserList" component={UserListStackScreen} />
      <Tab.Screen name="UserForm" component={UserForm} options={{headerShown: true}}/>
      {loggedInAs ?   <Tab.Screen name="UserInfo" component={UserInfo} options={{title: `${loggedInAs.firstName}`}} /> :undefined }
    </Tab.Navigator>
  </NavigationContainer>
  )
}
const Tab = createBottomTabNavigator()

export default function App() {

  return (
<Provider store={store}>
   <NavigationWrapper/>
    </Provider>
  );
}


