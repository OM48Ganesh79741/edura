import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StaffDirectory from './StaffDirectory'
import StaffAttendance from './StaffAttendance'


 const Stack = createNativeStackNavigator();
const Humanrewsource = () => {
   
  return (
    
      <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0f172a' },
        headerTintColor: '#fff'
      }}
    >

      {/* ✅ Default Screen FIRST */}
      <Stack.Screen 
        name="StaffDirectory" 
        component={StaffDirectory}
        options={{ title: "staff Directory" }}
      />


         <Stack.Screen 
        name="StaffAttendance" 
        component={StaffAttendance}
        options={{ title: "Staff Attendance" }}
      />

       </Stack.Navigator>

       
    
  
  )
    
}

export default Humanrewsource
