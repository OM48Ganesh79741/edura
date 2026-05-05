
import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from "./src/Context/AuthContext";

import Login from './src/component/Login';
// import Admin from './src/component/Admin';
import AdminPanal from "./src/component/AdminPanal";

import StaffDirectory from './src/component/screen/Human_resource/StaffDirectory';
import AddStaff from './src/component/screen/Human_resource/AddStaff'


import AddClassTimetable from './src/component/screen/Academics/AddClassTimetable';

const Stack = createNativeStackNavigator();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <AuthProvider> {/* ✅ WRAP HERE */}
      <NavigationContainer>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />


        //loginpage show first
        <Stack.Navigator initialRouteName="Login" >
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          {/* <Stack.Screen name="Admin" component={Admin} /> */}
          <Stack.Screen name="AdminPanal" component={AdminPanal}
            options={{ headerShown: false }}
          />

          <Stack.Screen name="StaffDirectory" component={StaffDirectory} />
          <Stack.Screen name="AddStaff" component={AddStaff} />
          <Stack.Screen name="AddClassTimetable" component={AddClassTimetable} />
        </Stack.Navigator>

      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;