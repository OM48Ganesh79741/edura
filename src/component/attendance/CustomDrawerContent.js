import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ExamStack from '../screen/Examinations/ExamStack';

const CustomDrawerContent = (props) => {

  const [open, setOpen] = useState(false);
  const [hrOpen, setHrOpen] = useState(false);
  const [examOpen, setExamOpen] = useState(false);
  const [academics, setacademics] = useState(false);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "OK",
        onPress: async () => {
          await AsyncStorage.removeItem('token');
          props.navigation.replace('Login');
        }
      }
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#020617' }}>


      <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>


        {/* design drawer when user  open logo */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AD</Text>
          </View>
          <Text style={styles.userName}>Admin Portal</Text>
        </View>

        <View style={{ padding: 10 }}>

          {/* Attendance */}
          <TouchableOpacity
            onPress={() => setOpen(!open)}
            style={styles.menuItem}
          >
            <View style={styles.row}>
              <Icon name="calendar-outline" size={22} color="#38bdf8" />
              <Text style={styles.menuText}>Attendance</Text>
            </View>
            <Icon
              name={open ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#94a3b8"
            />
          </TouchableOpacity>

          {open && (
            <View style={styles.subMenuContainer}>

              <TouchableOpacity
                style={styles.subMenuItem}
                onPress={() => props.navigation.navigate("Attendance", { screen: "StudentAttendance" })}
              >
                <Icon name="person-outline" size={18} color="#cbd5f5" />
                <Text style={styles.subMenuText}>Student Attendance</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.subMenuItem}
                onPress={() => props.navigation.navigate("Attendance", { screen: "ApproveLeave" })}
              >
                <Icon name="checkmark-circle-outline" size={18} color="#cbd5f5" />
                <Text style={styles.subMenuText}>Approve Leave</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.subMenuItem}
                onPress={() => props.navigation.navigate("Attendance", { screen: "PeriodAttendanceByDate" })}
              >
                <Icon name="checkmark-circle-outline" size={18} color="#cbd5f5" />
                <Text style={styles.subMenuText}>period Attendance By date</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.subMenuItem}
                onPress={() => props.navigation.navigate("Attendance", { screen: "AttendanceByDate" })}
              >
                <Icon name="time-outline" size={18} color="#cbd5f5" />
                <Text style={styles.subMenuText}>Attendance By Date</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.subMenuItem}
                onPress={() => props.navigation.navigate("Attendance", { screen: "PeriodAttendance" })}
              >
                <Icon name="list-outline" size={18} color="#cbd5f5" />
                <Text style={styles.subMenuText}>Period Attendance</Text>
              </TouchableOpacity>

            </View>
          )}



          {/* ✅ FIXED COMMENT */}
          {/* display human resource component */}

          {/* Human Resource */}
          <TouchableOpacity
            onPress={() => setHrOpen(!hrOpen)}
            style={styles.menuItem}
          >
            <View style={styles.row}>
              <Icon name="people-outline" size={22} color="#38bdf8" />
              <Text style={styles.menuText}>Human Resource</Text>
            </View>

            <Icon
              name={hrOpen ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#94a3b8"
            />
          </TouchableOpacity>

          {hrOpen && (
            <View style={styles.subMenuContainer}>

              <TouchableOpacity
                style={styles.subMenuItem}
                onPress={() => props.navigation.navigate("Human Resource", { screen: "StaffDirectory" })}
              >
                <Icon name="people-circle-outline" size={18} color="#cbd5f5" />
                <Text style={styles.subMenuText}>Staff Directory</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.subMenuItem}
                onPress={() => props.navigation.navigate("Human Resource", { screen: "AddStaff" })}
              >
                <Icon name="person-add-outline" size={18} color="#cbd5f5" />
                <Text style={styles.subMenuText}>Add Staff</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.subMenuItem}
                onPress={() => props.navigation.navigate("Human Resource", { screen: "StaffAttendance" })}
              >
                <Icon name="clipboard-outline" size={18} color="#cbd5f5" />
                <Text style={styles.subMenuText}>Staff Attendance</Text>
              </TouchableOpacity>

            </View>
          )}




          <TouchableOpacity
            onPress={() => setExamOpen(!examOpen)}
            style={styles.menuItem}
          >
            <View style={styles.row}>
              <Icon name="school-outline" size={22} color="#38bdf8" />
              <Text style={styles.menuText}>Examinations</Text>
            </View>

            <Icon
              name={examOpen ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#94a3b8"
            />
          </TouchableOpacity>

          {examOpen && (
            <View style={styles.subMenuContainer}>

              <TouchableOpacity
                style={styles.subMenuItem}
                onPress={() =>
                  props.navigation.navigate("Examinations", {
                    screen: "Exam Type"
                  })
                }
              >
                <Icon name="document-text-outline" size={18} color="#cbd5f5" />
                <Text style={styles.subMenuText}>Exam Type</Text>
              </TouchableOpacity>

            </View>
          )}








          {/* academics */}
          <TouchableOpacity
            onPress={() => setacademics(!academics)}
            style={styles.menuItem}
          >
            <View style={styles.row}>
              <Icon name="school-outline" size={22} color="#38bdf8" />
              <Text style={styles.menuText}>Academics</Text>
            </View>

            <Icon
              name={academics ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#94a3b8"
            />
          </TouchableOpacity>

          {academics && (
            <View style={styles.subMenuContainer}>

              <TouchableOpacity
                style={styles.subMenuItem}
                onPress={() =>
                  props.navigation.navigate("Academics", {
                    screen: "ClassTimetable"
                  })
                }
              >
                <Icon name="calendar-outline" size={18} color="#cbd5f5" />
                <Text style={styles.subMenuText}>Class Timetable</Text>
              </TouchableOpacity>


              <TouchableOpacity
                style={styles.subMenuItem}
                onPress={() => props.navigation.navigate("Academics", { screen: "Section" })}
              >
                <Icon name="layers-outline" size={18} color="#cbd5f5" />
                <Text style={styles.subMenuText}>Section Management</Text>
              </TouchableOpacity>

            </View>
          )}
        </View>

      </DrawerContentScrollView>
      <View style={styles.logoutContainer}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Icon name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#020617' },
  profileSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#38bdf8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  userName: { color: '#fff', fontSize: 16, fontWeight: '600' },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#0f172a',
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  menuText: { fontSize: 16, color: '#fff', marginLeft: 15 },
  subMenuContainer: {
    marginLeft: 20,
    marginTop: 5,
    borderLeftWidth: 1,
    borderLeftColor: '#334155',
  },
  subMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,

  },
  logoutContainer: {
    borderTopWidth: 1,
    borderTopColor: "#1E293B",
    padding: 15,

  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EF4444",
    padding: 12,
    borderRadius: 10,
    justifyContent: "center",

    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
  },

  logoutText: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "bold",
  },
  subMenuText: { color: '#cbd5f5', fontSize: 14, marginLeft: 10 },
});

export default CustomDrawerContent;