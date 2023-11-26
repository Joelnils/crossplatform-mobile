import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@rneui/base';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider, useSelector } from 'react-redux';
import UserList from './src/screens/UserList/UserList';
import { persistor, store } from './src/store/api/store'
import UserForm from './src/components/UserForm/UserForm'
import UserInfo from './src/screens/UserInfo/UserInfo';
import { PersistGate } from 'redux-persist/integration/react';
import PostForms from './src/screens/PostForm/PostForm';
import PostList from './src/screens/PostForm/PostList';

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
      <Tab.Screen name="PostForm" component={PostForms} />
      <Tab.Screen name="PostList" component={PostList} />

      {loggedInAs ?   <Tab.Screen name="UserInfo" component={UserInfo} options={{title: `${loggedInAs.firstName}`}} /> :undefined }
    </Tab.Navigator>
  </NavigationContainer>
  )
}
const Tab = createBottomTabNavigator()

export default function App() {

  return (
<Provider store={store}>
  <PersistGate loading={null} persistor={persistor}></PersistGate>
   <NavigationWrapper/>
    </Provider>
  );
}


