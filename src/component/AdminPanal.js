import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { TouchableOpacity, Text, Alert, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLayoutEffect } from 'react';

import AttendanceStack from './attendance/AttendanceStack';
import CustomDrawerContent from './attendance/CustomDrawerContent';

import Humanrewsource from './screen/Human_resource/Humanrewsource'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import ExamStack from './screen/Examinations/ExamStack';
import AcademicsStack from './screen/Academics/AcademicsStack';


const Drawer = createDrawerNavigator();


// ✅ 🔥 YAHAN BANAO (component ke bahar)
const getHeaderTitle = (route, defaultTitle) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? defaultTitle;

  switch (routeName) {
    case "StudentAttendance":
      return "Student Attendance";
    case "ApproveLeave":
      return "Approve Leave";
    case "AttendanceByDate":
      return "Attendance By Date";
    case "PeriodAttendance":
      return "Period Attendance";
    default:
      return defaultTitle;
  }
};

const AdminPanel = ({ navigation }) => {



  return (
    //make  a side menu
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({

        // --- 💨 Smooth Animation Settings ---
        // drawerType: 'slide', // Screen ko push karne wala animation
        drawerStyle: { backgroundColor: '#020617', width: 280 },


        // --- ✨ Header Styling ---
        headerStyle: {
          // backgroundColor: '#0f172a',
          elevation: 0, // Shadow hatakar border dena zyada clean lagta hai
          borderBottomWidth: 1,
          borderBottomColor: '#1e293b'
        },


        headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',

        // --- ☰ Menu Icon (Left) ---
        headerLeft: () => (
          <TouchableOpacity
            //THIS IS OPENING  A DRAWER AND CLOSE
            onPress={() => navigation.toggleDrawer()}
            style={styles.headerIconButton}
          >
            {/* Agar Icon nahi dikh raha, toh ensure karein font link hai */}
            <Icon name="menu-outline" size={16} color="#38bdf8" />
          </TouchableOpacity>
        ),



      })}
    >
      <Drawer.Screen
        name="Attendance"
        component={AttendanceStack}

      />

      <Drawer.Screen
        name="Human Resource"
        component={Humanrewsource}
      // options={{ title: "" }}
      />


      <Drawer.Screen
        name="Examinations"
        component={ExamStack}
      // options={{ title: "" }}
      />


      <Drawer.Screen
        name="Academics"
        component={AcademicsStack}
      // options={{ title: "" }}
      />



    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  // LEFT ICON
  headerIconButton: {
    marginLeft: 15,
    backgroundColor: "#1E293B",
    padding: 10,
    borderRadius: 12,
    height: 35,
    width: 35,

    // soft shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  // LOGOUT BUTTON
  logoutButton: {
    marginRight: 15,
    backgroundColor: "#EF4444",
    padding: 10,
    borderRadius: 50,

    // center icon
    justifyContent: "center",
    alignItems: "center",

    // glow effect 🔥
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  logoutText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1
  }
});

export default AdminPanel;









