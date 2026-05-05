import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, ActivityIndicator, Alert, SafeAreaView
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { Animated, Easing, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';



import API_BASE_URL from '../Config';



const AttendanceByDate = () => {
  // --- STATE MANAGEMENT ---

  const [sections, setSections] = useState([]);
  const [classList, setClassList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedSection, setSelectedSection] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(""); // YYYY-MM-DD
  const [session, setSession] = useState(null);

  const [AllStudent, SetAllStudent] = useState([])


  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateObj, setDateObj] = useState(new Date());

  //animatio value
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];
  const buttonScale = useState(new Animated.Value(1))[0];

  // 2👇 YAHAN likhna hai (top pe, useState ke saath)
  const titleAnim = useState(new Animated.Value(0))[0];

  const onChangeDate = (event, selectedDate) => {
    console.log("selected date" + selectedDate);

    setShowDatePicker(false);

    if (selectedDate) {
      setDateObj(selectedDate);

      // format YYYY-MM-DD
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');

      setAttendanceDate(`${year}-${month}-${day}`);
    }
  };



  useEffect(() => {
    Animated.timing(titleAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);



  useEffect(() => {
    fetchClass();
    fetchSession();
  }, []);


  //for animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);


  // --- LOGIC / SERVICES ---
  const getHeaders = async () => {
    const domainValue = await AsyncStorage.getItem('user_config');
    return { "Content-Type": "application/json", "domain": domainValue };
  };


  //fetch class
  async function fetchClass() {
    try {
      setLoading(true);
      const headers = await getHeaders();
      const res = await axios.get(`${API_BASE_URL}/class/uniqueclass`, { headers });
      setClassList(res.data);
    } catch (error) {
      Alert.alert("Error", "Could not fetch classes.");
      console.log("Class fetch error:", error);
    } finally {
      setLoading(false);
    }
  }


  //section fetch
  const fetchSections = async (classId) => {
    try {
      const headers = await getHeaders();
      const res = await axios.get(`${API_BASE_URL}/classSections/SectionsByClass/${classId}`, { headers });
      setSections(res.data);
    } catch (error) {
      console.log("Section fetch error:", error);
      setSections([]);
    }
  };


  //fetch section id
  const fetchSession = async () => {
    try {
      const sessionString = await AsyncStorage.getItem('sessionId');

      if (!sessionString) {
        console.log("Session not found");
        return;
      }

      const sessionData = JSON.parse(sessionString);

      if (sessionData && sessionData.id) {
        setSession(sessionData.id);
        console.log("session id ", sessionData.id);

      }
    } catch (error) {
      console.log("Session Error:", error);
    }
  };





  // const searchvalue = async () => {
  //   if (!selectedClass || !selectedSection || !attendanceDate) {
  //     alert("All fields are mandatory");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     SetAllStudent([]); // 🔥 CLEAR OLD DATA

  //     const headers = await getHeaders();

  //     const studentRes = await axios.get(
  //       `${API_BASE_URL}/student/getAllActiveBySession/${session}`,
  //       { headers }
  //     );

  //     const students = studentRes.data;

  //     const attendanceRes = await axios.get(
  //       `${API_BASE_URL}/studentAttendance/latest/${selectedClass}/${session}/${attendanceDate}`,
  //       { headers }
  //     );

  //     const attendanceData = attendanceRes.data;

  //     // ❗ CHECK EMPTY DATA
  //     if (!attendanceData || attendanceData.length === 0) {
  //       SetAllStudent([]);
  //       Alert.alert("No Data", "No attendance found");
  //       return;
  //     }

  //     const finalData = students.map((student) => {
  //       const studentId = student.studentSession?.[0]?.id;

  //       const attendance = attendanceData.find(
  //         (a) => a.student_session_id === studentId
  //       );

  //       return {
  //         admission_no: student?.admission_no,
  //         roll_no: student?.roll_no,
  //         name: `${student?.firstName || ""} ${student?.lastName || ""}`,
  //         resident: student?.resident_dayScholar,
  //         attendanceType: attendance
  //           ? attendance.attendanceTypeInfo?.attendancetype
  //           : "Not Marked",
  //       };
  //     });

  //     SetAllStudent(finalData);

  //   } catch (error) {
  //     console.log("ERROR:", error.response?.data || error.message);
  //     SetAllStudent([]); // ❗ error pe bhi clear
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  // // when user click on search button
  // const searchvalue = async () => {
  //   if (!selectedClass || !selectedSection || !attendanceDate) {
  //     alert("All fields are mandatory");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const headers = await getHeaders();

  //     // 1️⃣ Get ALL students (class + section + session)
  //     const studentRes = await axios.get(
  //       `${API_BASE_URL}/student/getAllActiveBySession/${session}`,
  //       { headers }
  //     );

  //     const students = studentRes.data;

  //     // 2️⃣ Get attendance for selected date
  //     const attendanceRes = await axios.get(
  //       `${API_BASE_URL}/studentAttendance/latest/${selectedClass}/${session}/${attendanceDate}`,
  //       { headers }
  //     );

  //     const attendanceData = attendanceRes.data;

  //     console.log("Students:", students);
  //     console.log("Attendance:", attendanceData);

  //     // 3️⃣ Merge logic
  //     const finalData = students.map((student) => {

  //       const studentId = student.studentSession?.[0]?.id;

  //       // find attendance of that student
  //       const attendance = attendanceData.find(
  //         (a) => a.student_session_id === studentId
  //       );

  //       return {
  //         admission_no: student?.admission_no,
  //         roll_no: student?.roll_no,
  //         name: `${student?.firstName || ""} ${student?.lastName || ""}`,
  //         resident: student?.resident_dayScholar,

  //         // 🔥 YAHAN MAGIC
  //         attendanceType: attendance
  //           ? attendance.attendanceTypeInfo?.attendancetype
  //           : "Not Marked",   // agar attendance nahi hai
  //       };
  //     });

  //     console.log("FINAL DATA:", finalData);

  //     SetAllStudent(finalData);

  //   } catch (error) {
  //     console.log("ERROR:", error.response?.data || error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };



  const searchvalue = async () => {
    if (!selectedClass || !selectedSection || !attendanceDate) {
      alert("All fields are mandatory");
      return;
    }

    try {
      setLoading(true);
      SetAllStudent([]);

      const headers = await getHeaders();

      // 1️⃣ ALL students
      const studentRes = await axios.get(
        `${API_BASE_URL}/student/getAllActiveBySession/${session}`,
        { headers }
      );

      const students = studentRes.data;

      // 2️⃣ Attendance API
      const attendanceRes = await axios.get(
        `${API_BASE_URL}/studentAttendance/latest/${selectedClass}/${session}/${attendanceDate}`,
        { headers }
      );

      const attendanceData = attendanceRes.data;

      if (!attendanceData || attendanceData.length === 0) {
        Alert.alert("No Data", "No attendance found");
        return;
      }

      // ✅ 3️⃣ FILTER FIRST (IMPORTANT)
      const filteredStudents = students.filter(student => {

        const classId =
          student.class_id ||
          student.classId ||
          student.class?.id ||
          student.studentSession?.[0]?.class_id;

        const sectionId =
          student.section_id ||
          student.sectionId ||
          student.section?.id ||
          student.studentSession?.[0]?.section_id;

        return (
          String(classId) === String(selectedClass) &&
          String(sectionId) === String(selectedSection)
        );
      });

      // ✅ 4️⃣ MAP AFTER FILTER
      const finalData = filteredStudents.map((student) => {

        const studentId = student.studentSession?.[0]?.id;

        const attendance = attendanceData.find(
          (a) => a.student_session_id === studentId
        );

        return {
          admission_no: student?.admission_no,
          roll_no: student?.roll_no,
          name: `${student?.firstName || ""} ${student?.lastName || ""}`,
          resident: student?.resident_dayScholar,

          attendanceType: attendance
            ? attendance.attendanceTypeInfo?.attendancetype
            : "Not Marked",
        };
      });

      SetAllStudent(finalData);

    } catch (error) {
      console.log("ERROR:", error.response?.data || error.message);
      SetAllStudent([]);
    } finally {
      setLoading(false);
    }
  };




  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  // --- RENDER ---
  return (
    <SafeAreaView style={styles.container}>
      {/* <View style={styles.card}> */}

      <Animated.View
        style={[
          styles.card,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >



        <Text style={styles.title}>Attendance By Date</Text>

        {/* Class Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Class *</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedClass}
              onValueChange={(itemValue) => {
                setSelectedClass(itemValue);
                setSelectedSection("");
                if (itemValue) fetchSections(itemValue);
                else setSections([]);
              }}
            >
              <Picker.Item label="Select Class" value="" color="#94A3B8" />
              {classList.map((item) => (
                <Picker.Item key={item.id} label={item.Class} value={item.id} />
              ))}
            </Picker>
          </View>
        </View>


        {/* Section Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Section *</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedSection}
              enabled={sections.length > 0}
              onValueChange={(itemValue) => setSelectedSection(itemValue)}
            >
              <Picker.Item label="Select Section" value="" color="#94A3B8" />
              {sections.map((item) => (
                <Picker.Item key={item.id} label={item.Section} value={item.id} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Date Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Attendance Date *</Text>

          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}


          >
            <Text style={{ color: attendanceDate ? "#000" : "#94A3B8" }}>
              {attendanceDate || "Select Date"}
            </Text>

            <Icon name="calendar-outline" size={20} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* Action Button */}


        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPressIn={handlePressIn}   // 👈 yaha call
            onPressOut={handlePressOut} // 👈 yaha call
            style={[styles.button, (!selectedSection || loading) && styles.buttonDisabled]}
            onPress={searchvalue}
            disabled={!selectedSection || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Search</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
        {/* </View> */}




        <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
          <View style={{ width: 600 }}>
            <View style={{
              flexDirection: "row",
              backgroundColor: "#ccc",
              padding: 10,
              marginTop: 40,
              borderRadius: 8,
              backgroundColor: "#4A90E2"

            }}>
              <Text style={{ flex: 1 }}>Adm No</Text>
              <Text style={{ flex: 1 }}>Roll</Text>
              <Text style={{ flex: 2 }}>Name</Text>
              <Text style={{ flex: 2 }}>Resident</Text>
              <Text style={{ flex: 1 }}>Attendance</Text>
            </View>

            {/* Table Data */}
            <FlatList
              data={AllStudent}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={{
                  flexDirection: "row",
                  padding: 10,
                  borderBottomWidth: 1,
                }}>
                  <Text style={styles.cell}>{item.admission_no}</Text>
                  <Text style={styles.cell}>{item.roll_no}</Text>
                  <Text style={[styles.cell, styles.name]}>{item.name}</Text>
                  <Text style={[styles.cell, styles.resident]}>{item.resident}</Text>
                  <Text style={[styles.cell, styles.status]}>
                    {item.attendanceType}
                  </Text>
                </View>
              )}


            />
          </View>
        </ScrollView>
        {showDatePicker && (
          <DateTimePicker
            value={dateObj}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}
      </Animated.View>




    </SafeAreaView>
  );
};

export default AttendanceByDate;

// --- STYLES ---
const styles = StyleSheet.create({

  container: {
    flex: 1,
    // backgroundColor: "#EEF2F7",
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    paddingTop: 20,
  },

  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 20,

    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#2563EB",
    marginBottom: 25,
    textAlign: "center",
    color: "blue"
  },

  inputGroup: {
    marginBottom: 18,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
    color: "#64748B",
  },

  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 5,
  },

  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: "#0F172A",
    backgroundColor: "#F8FAFC",
  },

  button: {
    marginTop: 20,
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",

    elevation: 3,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },

  buttonDisabled: {
    backgroundColor: "#A5B4FC",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },

  dateInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#F8FAFC",
  },

  row: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginVertical: 6,
    marginHorizontal: 8,

    // Shadow (Android + iOS)
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,

    alignItems: "center",
  },

  cell: {
    flex: 1,
    fontSize: 13,
    color: "#333",
  },

  name: {
    flex: 2,
    fontWeight: "600",
    color: "#222",
  },

  resident: {
    flex: 2,
    color: "#555",
  },

  status: {
    flex: 1,
    textAlign: "center",
    paddingVertical: 4,
    borderRadius: 6,
    overflow: "hidden",

    // default color
    backgroundColor: "#E3F2FD",
    color: "#1976D2",
    fontWeight: "600",
  }
});