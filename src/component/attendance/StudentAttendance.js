import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import BASE_URL from '../Config';
import { useLayoutEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Alert
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const StudentAttendance = ({ navigation }) => {

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  const [day, setDay] = useState('DD');
  const [month, setMonth] = useState('MM');
  const [year, setYear] = useState('YYYY');

  const [classList, setClassList] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());

  /* ✅ NEW STATE */
  const [attendanceStatus, setAttendanceStatus] = useState({});

  //new chages
  useEffect(() => {
    // Set current date on component mount
    const today = new Date();
    const d = today.getDate().toString().padStart(2, '0');
    const m = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const y = today.getFullYear().toString();

    setDay(d);
    setMonth(m);
    setYear(y);
    setDate(today); // also set date for DateTimePicker
  }, []);

  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({
      headerTitle: "Student Attendance",
    });
  }, [navigation]);

  useEffect(() => {
    fetchClass();
    fetchSession();
  }, []);

  // fetch session id
  const fetchSession = async () => {
    try {
      const sessionString = await AsyncStorage.getItem('sessionId');

      if (!sessionString) {
        console.log("Session not found");
        return;
      }

      const sessionData = JSON.parse(sessionString);
      console.log("session data: ", sessionData);


      if (sessionData && sessionData.id) {
        setSession(sessionData.id);
        console.log("session id ", sessionData.id);

      }
    } catch (error) {
      console.log("Session Error:", error);
    }
  };

  //GET A CLASS API
  const fetchClass = async () => {
    try {
      const domainValue = await AsyncStorage.getItem('user_config');
      console.log("domainValue", domainValue);


      const res = await axios.get(
        `${BASE_URL}/class/uniqueclass`,
        // "http://192.168.1.18:3000/class/uniqueclass",
        {
          headers: {
            "Content-Type": "application/json",
            "domain": domainValue
          }
        }
      );

      setClassList(res.data);
      console.log("unique class", res.data);

    } catch (error) {
      console.log("Class API Error:", error);
    }
  };

  // section fetch
  const fetchSections = async (classId) => {
    try {
      const domainValue = await AsyncStorage.getItem('user_config');

      const res = await axios.get(

        `${BASE_URL}/classSections/SectionsByClass/${classId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "domain": domainValue
          }
        }
      );

      setSections(res.data);

    } catch (error) {
      setSections([]);
    }
  };

  const handleClassChange = (value) => {
    setSelectedClass(value);
    setSelectedSection("");
    if (value) {
      fetchSections(value);
    }
  };

  /* ✅ NEW FUNCTION */
  const handleAttendanceChange = (studentId, status) => {
    setAttendanceStatus(prev => ({
      ...prev,
      [studentId]: status
    }));
  };


  // user click on search  attendance list shows
  // const handleSearch = async () => {

  //   if (!selectedClass || !selectedSection) {
  //     Alert.alert("Error", "Please select Class and Section");
  //     return;
  //   }

  //   if (!session) {
  //     Alert.alert("Session not loaded");
  //     return;
  //   }

  //   setLoading(true);

  //   try {

  //     const domainValue = await AsyncStorage.getItem('user_config');
  //     const formattedDate = `${year}-${month}-${day}`;

  //     /* attendance API */
  //     const attendanceCheck = await axios.get(
  //       `${BASE_URL}/studentAttendance/newtoget?className=${selectedClass}&sectionName=${selectedSection}&date=${formattedDate}`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           "domain": domainValue
  //         }
  //       }
  //     );

  //     /* student API (ALWAYS CALL) */
  //     const studentRes = await axios.get(
  //       `${BASE_URL}/student/getAllActiveBySession/${session}`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           "domain": domainValue
  //         }
  //       }
  //     );

  //     /* MERGE */
  //     const mergedData = studentRes.data.map(student => {

  //       const studentId = student.studentSession?.[0]?.id;

  //       const attendance = attendanceCheck.data.find(
  //         a => a.student_session_id === studentId
  //       );

  //       return {
  //         ...student,
  //         student_session_id: studentId,
  //         attendance_type_id: attendanceStatus[studentId] === 'Present' ? 1 :
  //           attendanceStatus[studentId] === 'Absent' ? 2 : null,
  //       };
  //     });

  //     setStudents(mergedData);

  //   } catch (error) {
  //     console.log("FULL ERROR:", error);
  //     console.log("RESPONSE:", error.response);
  //     Alert.alert("API Error", JSON.stringify(error.response?.data || error.message));
  //     console.log("Search Error:", error);
  //     Alert.alert("API Error");
  //     setStudents([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const handleSearch = async () => {

    if (!selectedClass || !selectedSection) {
      Alert.alert("Error", "Please select Class and Section");
      return;
    }

    if (!session) {
      Alert.alert("Session not loaded");
      return;
    }

    setLoading(true);

    try {
      const domainValue = await AsyncStorage.getItem('user_config');
      const formattedDate = `${year}-${month}-${day}`;

      // ✅ 1. Attendance API
      const attendanceRes = await axios.get(
        `${BASE_URL}/studentAttendance/newtoget/${selectedClass}/${selectedSection}/${formattedDate}`,
        {
          headers: {
            "Content-Type": "application/json",
            "domain": domainValue
          }
        }
      );

      const attendanceData = attendanceRes.data || [];

      // ✅ 2. Student API (ALWAYS CALL)
      const studentRes = await axios.get(
        `${BASE_URL}/student/getAllActiveBySession/${session}`,
        {
          headers: {
            "Content-Type": "application/json",
            "domain": domainValue
          }
        }
      );

      const allStudents = studentRes.data || [];

      let finalStudents = [];

      // ✅ 3. FILTER by class & section (IMPORTANT)
      const filteredStudents = allStudents.filter(student => {

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

      // ✅ 4. MERGE attendance
      finalStudents = filteredStudents.map(student => {

        const studentId = student.studentSession?.[0]?.id;

        const attendance = attendanceData.find(
          a => a.student_session_id === studentId
        );

        return {
          ...student,
          student_session_id: studentId,

          attendance_type_id: attendance?.attendance_type_id || null,
          attendance_type: attendance?.attendanceTypeInfo?.attendancetype || null
        };
      });

      // ✅ 5. SET STUDENTS
      setStudents(finalStudents);


      

      // ✅ 6. AUTO SELECT RADIO BUTTON (IMPORTANT)
      let statusObj = {};

      finalStudents.forEach(s => {
        if (s.attendance_type) {
          statusObj[s.student_session_id] = s.attendance_type;
        }
      });

      setAttendanceStatus(statusObj);

    } catch (error) {
      console.log("ERROR:", error.response?.data || error.message);
      Alert.alert("API Error", error.response?.data || error.message);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };


  const renderHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.columnHeader, { width: 90 }]}>Roll</Text>
      <Text style={[styles.columnHeader, { width: 150 }]}>Name</Text>
      <Text style={[styles.columnHeader, { width: 140 }]}>Attendance</Text>
    </View>
  );



  const renderItem = ({ item, index }) => {

    const studentId = item.student_session_id || item.id;

    return (
      <View style={styles.tableRow}>

        <Text style={[styles.cell, { width: 90 }]}>
          {item.roll_no || item.rollNo}
        </Text>

        <Text style={[styles.cell, { width: 150 }]}>
          {item.firstName} {item.lastName}
        </Text>

        <View style={[styles.cell, { width: 140, flexDirection: 'column', justifyContent: 'space-around' }]}>

          {/* ✅ PRESENT */}
          <TouchableOpacity
            onPress={() => handleAttendanceChange(studentId, 'Present')}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <View style={{
              height: 16,
              width: 16,
              borderRadius: 8,
              borderWidth: 2,
              borderColor: '#27ae60',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 5
            }}>
              {attendanceStatus[studentId] === 'Present' && (
                <View style={{
                  height: 8,
                  width: 8,
                  borderRadius: 4,
                  backgroundColor: '#27ae60'
                }} />
              )}
            </View>
            <Text>Present</Text>
          </TouchableOpacity>

          {/* ✅ LATE */}
          <TouchableOpacity
            onPress={() => handleAttendanceChange(studentId, 'Late')}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <View style={{
              height: 16,
              width: 16,
              borderRadius: 8,
              borderWidth: 2,
              borderColor: '#f39c12',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 5
            }}>
              {attendanceStatus[studentId] === 'Late' && (
                <View style={{
                  height: 8,
                  width: 8,
                  borderRadius: 4,
                  backgroundColor: '#f39c12'
                }} />
              )}
            </View>
            <Text>Late</Text>
          </TouchableOpacity>

          {/* ✅ ABSENT */}
          <TouchableOpacity
            onPress={() => handleAttendanceChange(studentId, 'Absent')}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <View style={{
              height: 16,
              width: 16,
              borderRadius: 8,
              borderWidth: 2,
              borderColor: '#e74c3c',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 5
            }}>
              {attendanceStatus[studentId] === 'Absent' && (
                <View style={{
                  height: 8,
                  width: 8,
                  borderRadius: 4,
                  backgroundColor: '#e74c3c'
                }} />
              )}
            </View>
            <Text>Absent</Text>
          </TouchableOpacity>

        </View>

      </View>
    );
  };


  /* ✅ UPDATED RENDER ITEM */
  // const renderItem = ({ item, index }) => {


  //   const studentId = item.student_session_id || item.id;

  //   return (
  //     <View style={styles.tableRow}>

  //       <Text style={[styles.cell, { width: 90 }]}>
  //         {item.roll_no || item.rollNo}
  //       </Text>

  //       <Text style={[styles.cell, { width: 150 }]}>
  //         {item.firstName} {item.lastName}
  //       </Text>

  //       <View style={[styles.cell, { width: 140, flexDirection: 'column', justifyContent: 'space-around' }]}>

  //         <TouchableOpacity
  //           onPress={() => handleAttendanceChange(studentId, 'Present')}
  //           style={{ flexDirection: 'row', alignItems: 'center' }}
  //         >
  //           <View style={{
  //             height: 16,
  //             width: 16,
  //             borderRadius: 8,
  //             borderWidth: 2,
  //             borderColor: '#27ae60',
  //             alignItems: 'center',
  //             justifyContent: 'center',
  //             marginRight: 5
  //           }}>
  //             {attendanceStatus[studentId] === 'Present' && (
  //               <View style={{
  //                 height: 8,
  //                 width: 8,
  //                 borderRadius: 4,
  //                 backgroundColor: '#27ae60'
  //               }} />
  //             )}
  //           </View>
  //           <Text>Present</Text>
  //         </TouchableOpacity>

  //         <TouchableOpacity
  //           onPress={() => handleAttendanceChange(studentId, 'Absent')}
  //           style={{ flexDirection: 'row', alignItems: 'center' }}
  //         >
  //           <View style={{
  //             height: 16,
  //             width: 16,
  //             borderRadius: 8,
  //             borderWidth: 2,
  //             borderColor: '#e74c3c',
  //             alignItems: 'center',
  //             justifyContent: 'center',
  //             marginRight: 5
  //           }}>
  //             {attendanceStatus[studentId] === 'Absent' && (
  //               <View style={{
  //                 height: 8,
  //                 width: 8,
  //                 borderRadius: 4,
  //                 backgroundColor: '#e74c3c'
  //               }} />
  //             )}
  //           </View>
  //           <Text>Absent</Text>
  //         </TouchableOpacity>

  //       </View>

  //     </View>
  //   );
  // };




  //  when user click on SAVE
  //  const saveAttendance = async () => {

  //   const formattedDate = `${year}-${month}-${day}`;

  //   // const attendanceData = students.map(student => {

  //   //   const studentId = student.student_session_id || student.id;

  //   //   return {
  //   //     student_session_id: studentId,
  //   //     attendance_type_id:
  //   //       attendanceStatus[studentId] === 'Present' ? 1 :
  //   //       attendanceStatus[studentId] === 'Absent' ? 2 : null,
  //   //     date: formattedDate,
  //   //     note: "",
  //   //     sessionId: session
  //   //   };
  //   // });


  //  const attendanceData = students.map(student => {

  //   const studentId = student.student_session_id || student.id;

  //   return {
  //     student_session_id: studentId,

  //     // 🔥 Direct string bhej
  //     attendance_type: attendanceStatus[studentId] || null,

  //     date: formattedDate,
  //     note: "",
  //     sessionId: session
  //   };
  // });



  //   // ✅ YAHI BANANA HAI (andar)
  //   const filteredData = attendanceData.filter(
  //     item => item.attendance_type_id !== null
  //   );

  //   console.log("FINAL DATA:", filteredData);

  //   try {
  //     const domainValue = await AsyncStorage.getItem('user_config');

  //     await axios.post(
  //       // "http://192.168.1.18:3000/studentAttendance/saveAttendance",
  //       `${BASE_URL}/studentAttendance/saveAttendance`,
  //       filteredData,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           "domain": domainValue
  //         }
  //       }
  //     );

  //     Alert.alert("Success", "Attendance Saved");

  //   } catch (error) {
  //     console.log("Save Error:", error);
  //     Alert.alert("Error", "Save Failed");
  //   }
  // };


  // const saveAttendance = async () => {

  //   const formattedDate = `${year}-${month}-${day}`;

  //   const attendanceData = students.map(student => {

  //     const studentId = student.student_session_id || student.id;

  //     return {
  //       student_session_id: studentId,

  //       // ✅ STRING send kar raha hai
  //       attendance_type: attendanceStatus[studentId] || null,

  //       date: formattedDate,
  //       note: "",
  //       sessionId: session
  //     };
  //   });

  //   // ✅ FIX (yahan change kiya)
  //   const filteredData = attendanceData.filter(
  //     item => item.attendance_type !== null
  //   );

  //   console.log("FINAL DATA:", filteredData);

  //   try {
  //     const domainValue = await AsyncStorage.getItem('user_config');

  //     await axios.post(
  //       `${BASE_URL}/studentAttendance/saveAttendance`,
  //       filteredData,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           "domain": domainValue
  //         }
  //       }
  //     );

  //     Alert.alert("Success", "Attendance Saved");

  //   } catch (error) {
  //     console.log("Save Error:", error.response?.data || error.message);
  //     Alert.alert("Error", "Save Failed");
  //   }
  // };



  // when user click on save button




  // when user click on s save button


  const saveAttendance = async () => {

    const formattedDate = `${year}-${month}-${day}`;

    // 🔥 STATUS → ID mapping  convert
    const statusMap = {
      Present: 1,
      Late: 2,
      Absent: 3
    };

    console.log("student", students);

    const attendanceData = students.map(student => {

      const studentId = student.student_session_id || student.id;

      return {
        student_session_id: studentId,

        // ✅ STRING → ID conversion
        attendance_type_id: statusMap[attendanceStatus[studentId]] || null,

        date: formattedDate,
        note: "",
        sessionId: session
      };
    });

    console.log("attendancedata", attendanceData);


    // ✅ sirf selected students  jisne sttendance select kiya hai
    const filteredData = attendanceData.filter(
      item => item.attendance_type_id !== null
    );

    console.log("FilterData DATA:", filteredData);

    try {
      const domainValue = await AsyncStorage.getItem('user_config');

      await axios.post(
        `${BASE_URL}/studentAttendance/saveAttendance`,
        filteredData,
        {
          headers: {
            "Content-Type": "application/json",
            "domain": domainValue
          }
        }
      );

      Alert.alert("Success", "Attendance Saved");

    } catch (error) {
      console.log("Save Error:", error.response?.data || error.message);
      Alert.alert("Error", "Save Failed");
    }
  };


  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    console.log(selectedDate);

    if (selectedDate) {
      const d = selectedDate.getDate().toString().padStart(2, '0');
      const m = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const y = selectedDate.getFullYear().toString();

      setDay(d);
      setMonth(m);
      setYear(y);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.mainContainer}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formCard}>

          <Text style={styles.cardTitle}>Student Attendance</Text>

          <Text style={styles.label}>Class *</Text>
          <View style={styles.pickerBox}>
            <Picker selectedValue={selectedClass} onValueChange={handleClassChange}>
              <Picker.Item label="Select Class" value="" />
              {classList.map(item => (
                <Picker.Item key={item.id} label={item.Class} value={item.id} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Section *</Text>
          <View style={styles.pickerBox}>
            <Picker selectedValue={selectedSection} onValueChange={setSelectedSection}>
              <Picker.Item label="Select Section" value="" />
              {sections.map(item => (
                <Picker.Item key={item.id} label={item.Section} value={item.id} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Date *</Text>

          {/* <View style={styles.manualDateRow}>
            <TextInput style={styles.datePartInput} value={day} onChangeText={setDay} />
            <Text style={styles.separator}>-</Text>
            <TextInput style={styles.datePartInput} value={month} onChangeText={setMonth} />
            <Text style={styles.separator}>-</Text>
            <TextInput style={styles.datePartInput} value={year} onChangeText={setYear} />
          </View> */}

          {/* <TouchableOpacity>
  <Text>{day}-{month}-{year}</Text>
   <Icon name="calendar-outline" size={20} color="#2563EB" />
</TouchableOpacity> */}

          <TouchableOpacity
            style={styles.datePickerBtn}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {day}-{month}-{year}
            </Text>

            <Icon name="calendar-outline" size={20} color="#2563EB" />
          </TouchableOpacity>
          {
            showDatePicker &&
            <DateTimePicker
              value={date}
              mode="date"
              display='default'
              onChange={onChangeDate}
              maximumDate={new Date()}

            />
          }





          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            <Text style={styles.searchBtnText}>
              {loading ? "Fetching..." : "Search"}
            </Text>
          </TouchableOpacity>

          <View style={styles.studentListSection}>
            <View style={styles.actionRow}>
              <Text style={styles.title}>Student List</Text>

              <TouchableOpacity style={styles.saveBtn} onPress={saveAttendance}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>

            </View>

            <ScrollView horizontal>
              <View>
                {renderHeader()}

                <FlatList
                  data={students || []}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => index.toString()}
                />

              </View>
            </ScrollView>

          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default StudentAttendance;

const styles = StyleSheet.create({

  mainContainer: {
    flex: 1,
    backgroundColor: '#EEF2F7'
  },

  scrollContent: {
    padding: 16
  },

  formCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 16,

    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 15,
    color: '#1b0fa5d8',        // dark professional text
    letterSpacing: 0.5,      // subtle spacing
  },

  label: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B'
  },

  pickerBox: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    marginTop: 5
  },

  manualDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    justifyContent: 'space-between'
  },

  datePartInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
    width: '28%',
    textAlign: 'center',
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    fontSize: 14
  },

  separator: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#64748B'
  },

  searchBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    marginTop: 18,
    borderRadius: 10,
    alignItems: 'center',

    elevation: 2,
    shadowColor: '#2563EB',
    shadowOpacity: 0.3,
    shadowRadius: 5
  },

  searchBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15
  },

  studentListSection: {
    marginTop: 25
  },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B'
  },

  saveBtn: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8
  },

  saveBtnText: {
    color: '#fff',
    fontWeight: '600'
  },

  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginTop: 10
  },

  columnHeader: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 13
  },

  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 10
  },

  cell: {
    textAlign: 'center',
    fontSize: 13,
    color: '#334155'
  },

  datePickerBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 14,
    marginTop: 8,
    backgroundColor: '#F8FAFC'
  },

  dateText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B'
  },

});