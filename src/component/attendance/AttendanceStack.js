
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import StudentAttendance from './StudentAttendance';
import AttendanceByDate from './AttendanceByDate';
import PeriodAttendance from './PeriodAttendance';
import ApproveLeave from './ApproveLeave';
import PeriodAttendanceByDate from './PeriodAttendanceByDate';

const Stack = createNativeStackNavigator();

const AttendanceStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0f172a' },
        headerTintColor: '#fff'
      }}
    >

      {/* ✅ Default Screen FIRST */}

      <Stack.Screen
        name="StudentAttendance"
        component={StudentAttendance}
        options={{
          title: "Student Attendance",

          // 🔵 Background color change
          headerStyle: {
            backgroundColor: "#2563EB", // apna color daalo
           
          },

          // ⚪ Title color
          headerTintColor: "#fff",

          // 🔤 Title style (optional)
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
          },
        }}
      />

      <Stack.Screen
        name="ApproveLeave"
        component={ApproveLeave}
        options={{ title: "Approve Leave" }}
      />

      <Stack.Screen
        name="PeriodAttendanceByDate"
        component={PeriodAttendanceByDate}
        options={{ title: "Period Attendanc By Date" }}
      />

      <Stack.Screen
        name="AttendanceByDate"
        component={AttendanceByDate}
        options={{
          title: "Attendance By Date",
          // Header background
          headerStyle: {
            backgroundColor: "#2563EB",
            elevation: 0, // Android shadow remove
            shadowOpacity: 0, // iOS shadow remove
          },

          // Title style
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "700",
          },

          // Title color
          headerTintColor: "#fff",

          // Center title (Android)
          headerTitleAlign: "center",
        }}
      />

      <Stack.Screen
        name="PeriodAttendance"
        component={PeriodAttendance}
        options={{ title: "Period Attendance" }}
      />

    </Stack.Navigator>
  );
};

export default AttendanceStack;