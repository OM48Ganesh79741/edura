
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { Modal } from 'react-native';

import DocumentPicker from '@react-native-documents/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import BASE_URL from '../Config';
import Icon from 'react-native-vector-icons/Ionicons';

const ApproveLeave = () => {
  const [classList, setClassList] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");

  const [leaveList, setLeaveList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [session, setSession] = useState(null);

  const [studentList, setStudentList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");

  const [allStudents, setAllStudents] = useState([]);

  const [applyDate, setApplyDate] = useState(new Date());
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());

  const [showApply, setShowApply] = useState(false);
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);


  const [file, setFile] = useState(null);
  const [leaveReason, setLeaveReason] = useState("");



  // Modal ke liye alag state
  const [modalClass, setModalClass] = useState("");
  const [modalSection, setModalSection] = useState("");
  const [modalStudentList, setModalStudentList] = useState([]);
  const [modalStudent, setModalStudent] = useState("");


  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1; // tum change kar sakte ho

  // modal filter student based on class and section

  useEffect(() => {
    if (modalClass && modalSection && allStudents.length > 0) {
      const filtered = allStudents.filter((student) => {
        return student.studentSession?.some(
          (s) =>
            String(s.class_id) === String(modalClass) &&
            String(s.section_id) === String(modalSection)
        );
      });

      setModalStudentList(filtered);
    }
  }, [modalClass, modalSection, allStudents]);


  useEffect(() => {
    setCurrentPage(1);
  }, [displayList]);

  // ✅ INITIAL LOAD
  useEffect(() => {
    fetchClass();
    fetchSession();
  }, []);

  // ✅ SESSION + MODAL → FETCH All student STUDENTS
  useEffect(() => {
    if (modalVisible && session) {
      fetchAllStudents();
    }
  }, [modalVisible, session]);

  // ✅ FILTER STUDENTS (FIXED)
  useEffect(() => {
    if (selectedClass && selectedSection && allStudents.length > 0) {
      const filtered = allStudents.filter((student) => {
        return student.studentSession?.some(
          (s) =>
            String(s.class_id) === String(selectedClass) &&
            String(s.section_id) === String(selectedSection)
        );
      });

      console.log("Filtered Students:", filtered);
      setStudentList(filtered);
    }
  }, [selectedClass, selectedSection, allStudents]);

  // ✅ FETCH ALL STUDENTS
  const fetchAllStudents = async () => {
    try {
      const domainValue = await AsyncStorage.getItem('user_config');

      const res = await axios.get(
        `${BASE_URL}/student/getAllActiveBySession/${session}`,
        {
          headers: {
            "Content-Type": "application/json",
            "domain": domainValue
          }
        }
      );

      console.log("ALL Students:", res.data);
      setAllStudents(res.data);

    } catch (error) {
      console.log("All Student API Error:", error);
    }
  };

  // ✅ FETCH SESSION (FIXED)
  const fetchSession = async () => {
    try {
      const sessionString = await AsyncStorage.getItem('sessionId');

      console.log("RAW:", sessionString);

      if (!sessionString) {
        console.log("Session not found");
        return;
      }

      const sessionData = JSON.parse(sessionString);

      console.log("session data:", sessionData);

      if (sessionData?.id) {
        setSession(sessionData.id);
        console.log("SESSION ID:", sessionData.id);
      }

    } catch (e) {
      console.log("Parse Error:", e);
    }
  };

  // ✅ FETCH CLASS
  const fetchClass = async () => {
    try {
      const domainValue = await AsyncStorage.getItem('user_config');

      const res = await axios.get(`${BASE_URL}/class/uniqueclass`, {
        headers: { "Content-Type": "application/json", "domain": domainValue }
      });

      setClassList(res.data);
      console.log("class data: ", res.data);

    } catch (error) {
      console.log("Class API Error:", error);
    }
  };

  // ✅ FETCH SECTION
  const fetchSection = async (classId) => {
    try {
      console.log("classid: ", classId);

      const domainValue = await AsyncStorage.getItem('user_config');
      const res = await axios.get(
        `${BASE_URL}/classSections/SectionsByClass/${classId}`,
        {
          headers: { "Content-Type": "application/json", "domain": domainValue }
        }
      );

      setSectionList(res.data);
      console.log("sectionList: ", res.data);

    } catch (error) {
      console.log("Section API Error:", error);
    }
  };

  // ⚠️ KEEP FUNCTION (NOT REMOVED - AS YOU SAID STRUCTURE SAME)
  const fetchStudents = async (sectionId) => {
    try {
      console.log("sectionid pass fetch student: ", sectionId);

      const domainValue = await AsyncStorage.getItem('user_config');

      const res = await axios.get(
        `${BASE_URL}/student/getBySection/${sectionId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "domain": domainValue
          }
        }
      );

      // ❌ DON'T override filtered data if allStudents already used
      console.log("student : ", res.data);

    } catch (error) {
      console.log("Student API Error:", error);
    }
  };


  // when user click on submit button
  const submitData = (() => {
    console.log("submitted");

  })

  // ✅ SEARCH then section and class wise leave add in list
  const handleSearch = async () => {
    if (!selectedClass || !selectedSection) {
      Alert.alert("please select class and section");
      return;
    }

    const domainValue = await AsyncStorage.getItem('user_config');
    setLoading(true);

    try {
      const res = await axios.get(
        `${BASE_URL}/addleave/approveStudentLeavByClassSectionId/${selectedClass}/${selectedSection}`,
        {
          headers: {
            "Content-Type": "application/json",
            "domain": domainValue
          }
        }
      );

      setLeaveList(res.data);
      console.log("All StudentList: ", res.data);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };






  // 📂 when user clicl on upload files im modal
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        allowMultiSelection: false,
      });

      setFile(result[0]);
      console.log(result[0]);

    } catch (err) {

      // ✅ THIS IS THE FIX
      if (err?.code === 'DOCUMENT_PICKER_CANCELED') {
        console.log('User cancelled');
      } else {
        console.log('Error:', err);
      }

    }
  };



  // when user click on submit button in modal
  const submitRequest = async () => {
    try {

      //leave reason is manditory

      if (!modalClass) {
        Alert.alert("Validation Error", "Please select a Class");
        return;
      }
      if (!modalSection) {
        Alert.alert("Validation Error", "Please select a Section");
        return;
      }
      if (!modalStudent) {
        Alert.alert("Validation Error", "Please select a Student");
        return;
      }
      if (!applyDate) {
        Alert.alert("Validation Error", "Please select Apply Date");
        return;
      }
      if (!fromDate) {
        Alert.alert("Validation Error", "Please select From Date");
        return;
      }
      if (!toDate) {
        Alert.alert("Validation Error", "Please select To Date");
        return;
      }
      if (!leaveReason?.trim()) {
        Alert.alert("Validation Error", "Please enter Leave Reason");
        return;
      }


      const domainValue = await AsyncStorage.getItem('user_config');

      let parsedDomain;
      try {
        parsedDomain = JSON.parse(domainValue);
      } catch {
        parsedDomain = domainValue;
      }

      const payload = {
        class: modalClass,
        section: modalSection,
        student_session_id: modalStudent,
        applyDate: applyDate.toISOString().split("T")[0],
        formdate: fromDate.toISOString().split("T")[0],
        todate: toDate.toISOString().split("T")[0],
      };

      if (leaveReason?.trim()) {
        payload.leaveReason = leaveReason;
      }

      const res = await axios.post(
        `${BASE_URL}/addleave`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            domain: parsedDomain,
          },
        }
      );

      console.log("SUCCESS:", res.data);
      // ✅ Success Alert
      Alert.alert("Success", "Leave Applied Successfully");

      // ✅ Reset form


      setModalClass("");
      setModalSection("");
      setModalStudent("");
      setModalStudentList([]);
      // setSelectedClass("");
      // setSelectedSection("");
      // setSelectedStudent("");
      // setStudentList([]);
      setApplyDate(new Date());
      setFromDate(new Date());
      setToDate(new Date());
      setLeaveReason("");
      setFile(null);

      // ✅ Close modal
      setModalVisible(false);




    } catch (error) {
      console.log("ERROR:", error.response?.data || error.message);
    }
  };


  // when teacher search  student
  const filteredLeaveList = leaveList.filter((item) => {
    const studentName =
      item.studentLeaveStudentSessionInfo.studentInfo.firstName +
      " " +
      item.studentLeaveStudentSessionInfo.studentInfo.lastName;

    return studentName.toLowerCase().includes(search.toLowerCase());
  });

  const displayList = search.trim() === "" ? leaveList : filteredLeaveList;


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentData = displayList.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(displayList.length / itemsPerPage) || 1;

  // teacher approve leavev
  const approveLeave = async (id) => {
    try {
      const domainValue = await AsyncStorage.getItem('user_config');

      console.log("APPROVE ID:", id);

      const res = await axios.put(
        `${BASE_URL}/addleave/${id}`,
        {
          status: "APPROVED"
        }, // 👈 empty body
        {
          headers: {
            "Content-Type": "application/json",
            domain: domainValue
          }
        }
      );

      console.log("Approved:", res.data);
      handleSearch();

    } catch (error) {
      console.log("Approve Error:", error.response?.data || error.message);
    }
  };

  //delete by teacher

  const StudentDelete = async (id) => {
    try {
      const domainValue = await AsyncStorage.getItem('user_config');

      console.log("APPROVE ID:", id);

      const res = await axios.delete(
        `${BASE_URL}/addleave/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            domain: domainValue
          }
        }
      );

      console.log("delete:", res.data);
      handleSearch();

    } catch (error) {
      console.log("Approve Error:", error.response?.data || error.message);
    }
  };




  // updateStatus rejected or approval
  const updateStatus = async (id, status) => {
    try {
      const domainValue = await AsyncStorage.getItem('user_config');

      const res = await axios.put(
        `${BASE_URL}/addleave/${id}`,
        { status },   // 🔥 dynamic status
        {
          headers: {
            "Content-Type": "application/json",
            domain: domainValue
          }
        }
      );

      console.log("Updated:", res.data);

      // ✅ UI update instantly
      setLeaveList((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status } : item
        )
      );

    } catch (error) {
      console.log("Status Update Error:", error.response?.data || error.message);
    }
  };


  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F1F5F9" />

      {/* HEADER */}
      <View style={styles.pageHeader}>
        <Text style={styles.mainTitle}>Approve Leave</Text>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            setModalVisible(true);

            setModalClass("");
            setModalSection("");
            setModalStudent("");
            setModalStudentList([]);
          }}
        >
          <Icon name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.addText}>Add Leave</Text>
        </TouchableOpacity>
      </View>

      {/* FILTER */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Icon name="filter-outline" size={18} color="#2563EB" />
          <Text style={styles.cardLabel}>Select Criteria</Text>
        </View>

        <View style={styles.row}>
          {/* CLASS */}
          <View style={styles.pickerContainer}>
            <Text style={styles.fieldLabel}>Class</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedClass}
                onValueChange={(itemValue) => {
                  // we store id jo class ke sath aa rahi hia
                  setSelectedClass(itemValue);
                  setSelectedSection("");
                  setStudentList([]);
                  if (itemValue) fetchSection(itemValue);
                }}
              >
                <Picker.Item label="Choose Class" value="" />
                {classList.map((item) => (
                  <Picker.Item key={item.id} label={item.Class} value={item.id} />
                ))}
              </Picker>
            </View>
          </View>

          {/* SECTION */}
          <View style={styles.pickerContainer}>
            <Text style={styles.fieldLabel}>Section</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedSection}
                enabled={selectedClass !== ""}
                onValueChange={(itemValue) => {
                  setSelectedSection(itemValue);
                  setStudentList([]);
                }}
              >
                <Picker.Item label="Choose Section" value="" />
                {sectionList.map((item) => (
                  <Picker.Item key={item.id} label={item.Section} value={item.id} />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Icon name="search-outline" size={18} color="#fff" />
          <Text style={styles.searchText}>Search Records</Text>
        </TouchableOpacity>
      </View>

      {/* TABLE */}
      <View style={[styles.card, { flex: 1 }]}>
        <Text style={styles.tableTitle}>Leave List</Text>


        {/* //search bar */}
        <TextInput
          placeholder='search here...'
          style={styles.search}
          value={search}
          onChangeText={(text) => { setSearch(text) }}
        />

        {loading ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>Loading...</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} nestedScrollEnabled={true} >
            <View style={{ flex: 1 }}>

              <ScrollView
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
                contentContainerStyle={{ flexGrow: 1 }}
              >
                <View>
                  <View style={styles.tableHeaderRow}>
                    <Text style={[styles.th, { width: 100 }]}>Class</Text>
                    <Text style={[styles.th, { width: 80 }]}>Section</Text>
                    <Text style={[styles.th, { width: 150 }]}>Student</Text>
                    <Text style={[styles.th, { width: 120 }]}>Apply Date</Text>
                    <Text style={[styles.th, { width: 120 }]}>From Date</Text>
                    <Text style={[styles.th, { width: 120 }]}>To Date</Text>
                    <Text style={[styles.th, { width: 150 }]}>Leave reason</Text>
                    <Text style={[styles.th, { width: 150 }]}>Status</Text>
                    <Text style={[styles.th, { width: 120 }]}>Approved By</Text>
                    <Text style={[styles.th, { width: 150 }]}>Action</Text>
                  </View>

                  {currentData.length === 0 ? (
                    <View style={styles.noDataWrapper}>
                      <Icon name="document-text-outline" size={50} color="#CBD5E1" />
                      <Text style={styles.noDataText}>No Data Available</Text>
                    </View>
                  ) : (
                    currentData.map((item, index) => (
                      <View key={index} style={styles.tableRow}>
                        <Text style={{ width: 100 }}>{item.studentLeaveStudentSessionInfo.class_id}</Text>
                        <Text style={{ width: 80 }}>{item.studentLeaveStudentSessionInfo.studentSectionInfo.Section}</Text>
                        <Text style={{ width: 150 }}>{item.studentLeaveStudentSessionInfo.studentInfo.firstName + "  " + item.studentLeaveStudentSessionInfo.studentInfo.lastName}</Text>
                        <Text style={{ width: 120 }}>{item.apply_date.split("T")[0]}</Text>
                        <Text style={{ width: 120 }}>{item.from_date.split("T")[0]}</Text>
                        <Text style={{ width: 120 }}>{item.to_date.split("T")[0]}</Text>
                        <Text style={{ width: 150 }}>{item.leave_reason}</Text>

                        {/* leave  approved by teaher */}
                        <Text style={{
                          width: 150,
                          fontWeight: "bold",
                          color:
                            item.status === "APPROVED"
                              ? "green"
                              : item.status === "REJECTED"
                                ? "red"
                                : "orange"
                        }}>
                          {item.status ? item.status : "PENDING..."}
                        </Text>


                        <Text style={{ width: 150 }}>{item.status}</Text>

                        <View style={[styles.actionColumn, { width: 160 }]}>

                          {/* 1. Check Icon (Purple/Pink Circle) */}
                          <TouchableOpacity
                            style={styles.actionIconContainer}
                            onPress={() => approveLeave(item.id)}
                          >
                            <View style={styles.checkBg}>
                              <Icon name="checkmark" size={12} color="#fff" />
                            </View>
                          </TouchableOpacity>

                          {/* 2. Download Icon (Blue Circle) */}
                          <TouchableOpacity
                            style={styles.actionIconContainer}
                            onPress={() => console.log('Download pressed for:', item.id)}
                          >
                            <View style={styles.downloadBg}>
                              <Icon name="cloud-download-outline" size={14} color="#fff" />
                            </View>
                          </TouchableOpacity>

                          {/* 3. Edit Icon (Orange Circle)  when teacher edit  leave rejected or pending*/}

                          <TouchableOpacity
                            style={styles.actionIconContainer}
                            onPress={() =>
                              Alert.alert(
                                "Change Status",
                                "Select action",
                                [
                                  {
                                    text: "Approve",
                                    onPress: () => updateStatus(item.id, "APPROVED")
                                  },
                                  {
                                    text: "Reject",
                                    onPress: () => updateStatus(item.id, "REJECTED")
                                  },
                                  {
                                    text: "Cancel",
                                    style: "cancel"
                                  }
                                ]
                              )
                            }
                          >
                            <View style={styles.editBg}>
                              <Icon name="pencil" size={12} color="#fff" />
                            </View>
                          </TouchableOpacity>

                          {/* 4. Delete Icon (Red Circle) */}
                          <TouchableOpacity
                            style={styles.actionIconContainer}
                            onPress={() => StudentDelete(item.id)}
                          >
                            <View style={styles.deleteBg}>
                              <Icon name="trash-outline" size={14} color="#fff" />
                            </View>
                          </TouchableOpacity>

                        </View>

                      </View>
                    ))
                  )}
                </View>
              </ScrollView>
            </View>
          </ScrollView>
        )}
        <View style={styles.paginationContainer}>

          <TouchableOpacity
            disabled={currentPage === 1}
            onPress={() => setCurrentPage(prev => prev - 1)}
            style={[
              styles.pageBtn,
              currentPage === 1 && styles.disabledBtn
            ]}
          >
            <Text style={styles.pageText}>Prev</Text>
          </TouchableOpacity>

          <Text style={styles.pageNumber}>
            {currentPage} / {totalPages}
          </Text>

          <TouchableOpacity
            disabled={currentPage >= totalPages}
            onPress={() => setCurrentPage(prev => prev + 1)}
            style={[
              styles.pageBtn,
              currentPage >= totalPages && styles.disabledBtn
            ]}
          >
            <Text style={styles.pageText}>Next</Text>
          </TouchableOpacity>

        </View>
      </View>


      {/* MODAL */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>

          <View style={styles.modalContainer}>

            {/* STICKY MODAL HEADER */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Add Leave Request</Text>
                <Text style={styles.modalSubtitle}>Fill in the details below</Text>
              </View>
              <TouchableOpacity
                style={styles.closeCircle}
                onPress={() => setModalVisible(false)}
              >
                <Icon name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>



          //select a class inside a modal

              <View style={styles.formGroup}>
                <Text style={styles.label}>Class <Text style={{ color: 'red' }}>*</Text></Text>
                <View style={styles.modernPickerWrapper}>
                  <Picker
                    // selectedValue={selectedClass}
                    // onValueChange={(val) => {
                    //   setSelectedClass(val);
                    //   setSelectedSection("");
                    //   setStudentList([]);
                    //   if (val) fetchSection(val);

                    selectedValue={modalClass}
                    onValueChange={(val) => {
                      setModalClass(val);
                      setModalSection("");
                      setModalStudent("");
                      if (val) fetchSection(val);

                    }}
                  >
                    <Picker.Item label="Select Class" value="" color="#94A3B8" />
                    {classList.map((item) => (
                      <Picker.Item key={item.id} label={item.Class} value={item.id} />
                    ))}
                  </Picker>
                </View>
              </View>



              //select a section in modal

              <View style={styles.formGroup}>
                <Text style={styles.label}>Section <Text style={{ color: 'red' }}>*</Text></Text>
                <View style={styles.modernPickerWrapper}>
                  <Picker
                    // selectedValue={selectedSection}
                    // enabled={selectedClass !== ""}
                    // onValueChange={(val) => {
                    //   setSelectedSection(val);
                    //   setSelectedStudent("");

                    selectedValue={modalSection}
                    onValueChange={(val) => {
                      setModalSection(val);
                      setModalStudent("");
                    }}
                  >
                    <Picker.Item label="Select Section" value="" color="#94A3B8" />
                    {sectionList.map((item) => (
                      <Picker.Item key={item.id} label={item.Section} value={item.id} />
                    ))}
                  </Picker>
                </View>
              </View>


 //select student base d on class and section

              <View style={styles.formGroup}>
                <Text style={styles.label}>Student <Text style={{ color: 'red' }}>*</Text></Text>
                <View style={styles.modernPickerWrapper}>
                  <Picker
                    // selectedValue={selectedStudent}
                    // enabled={selectedSection !== ""}
                    // onValueChange={(val) => setSelectedStudent(val)}


                    selectedValue={modalStudent}
                    onValueChange={(val) => {
                      setModalStudent(val);
                      // setModalStudent("");
                      // setModalStudentList([]); // ✅ ADD THIS
                    }}
                  >
                    <Picker.Item label="Select Student" value="" color="#94A3B8" />
                    {modalStudentList.map((item) => (
                      <Picker.Item
                        key={item.id}
                        label={`${item.firstName} ${item.lastName}`}
                        value={item.studentSession[0]?.id}
                      />
                    ))}
                  </Picker>
                </View>
              </View>


              {/* apply date */}

              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Apply Date</Text>


                  //display only icon
                <TouchableOpacity
                  style={styles.modernInput}
                  onPress={() => setShowApply(true)}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>
                      <Text>{applyDate.toLocaleDateString('en-GB')}</Text>

                    </Text>
                    <Icon name="calendar-outline" size={20} color="#64748B" />
                  </View>
                </TouchableOpacity>

                 //open  calender for apply date
                {showApply && (
                  <DateTimePicker
                    value={applyDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowApply(false);
                      if (selectedDate) setApplyDate(selectedDate);
                    }}
                  />
                )}
              </View>

              //form date
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>From Date</Text>


                  //display only icon
                <TouchableOpacity
                  style={styles.modernInput}
                  onPress={() => setShowFrom(true)}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>
                      {fromDate.toLocaleDateString('en-GB')}

                    </Text>
                    <Icon name="calendar-outline" size={20} color="#64748B" />
                  </View>
                </TouchableOpacity>

                 //open  calender
                {showFrom && (
                  <DateTimePicker
                    value={fromDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowFrom(false);
                      if (selectedDate) setFromDate(selectedDate);
                    }}
                  />
                )}
              </View>


              {/* to date */}
              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>To Date</Text>

                <TouchableOpacity
                  style={styles.modernInput}
                  onPress={() => setShowTo(true)}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>
                      {toDate.toLocaleDateString('en-GB')}

                    </Text>
                    <Icon name="calendar-outline" size={20} color="#64748B" />
                  </View>
                </TouchableOpacity>

                {showTo && (
                  <DateTimePicker
                    value={toDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowTo(false);
                      if (selectedDate) setToDate(selectedDate);
                    }}
                  />
                )}
              </View>

            //reason
              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Reason</Text>

                <View style={styles.modernInput}>
                  <TextInput
                    placeholder="Enter Leave Reason (Optional)"
                    placeholderTextColor="#94A3B8"
                    value={leaveReason}
                    onChangeText={setLeaveReason}
                    style={styles.textArea}
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </View>


              {/* File Upload Button */}
              <View style={styles.container}>

                <View style={styles.uploadContainer}>

                  {/* Upload Button */}
                  <TouchableOpacity style={styles.uploadBtn} onPress={pickDocument}>
                    <Text style={styles.uploadText}>Upload Document</Text>
                  </TouchableOpacity>

                  {/* File Name Display */}
                  {file && (
                    <View style={styles.fileBox}>
                      <Text style={styles.fileText}>{file.name}</Text>

                      {/* Logo / Preview (only for images) */}
                      {file.type && file.type.startsWith('image/') && (
                        <Image
                          source={{ uri: file.uri }}
                          style={styles.imagePreview}
                        />
                      )}
                    </View>
                  )}

                </View>

              </View>






              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => {
                    setModalVisible(false);
                    setModalClass("");
                    setModalSection("");
                    setModalStudent("");
                    setModalStudentList([]);
                  }

                  }
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.submitBtn} onPress={submitRequest}>
                  <Icon name="checkmark-circle" size={18} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.submitBtnText}>Submit Request</Text>
                </TouchableOpacity>
              </View>

            </ScrollView>
          </View>
        </View>
      </Modal>

    </View>
  );
};

export default ApproveLeave;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 16,
  },

  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center',
  },

  mainTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1E293B"
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 8
  },

  row: { flexDirection: "row", gap: 10 },

  pickerContainer: { flex: 1 },

  pickerWrapper: {
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 5
  },
  addBtn: {
    flexDirection: 'row',
    backgroundColor: "#6366F1", // Indigo - Looks premium
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 6,
    elevation: 3,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },


  addText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 6
  },

  searchBtn: {
    marginTop: 15,
    backgroundColor: "#059669", // Emerald Green - Success/Action color
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    elevation: 2,
  },

  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#eee",
    padding: 10
  },

  th: { fontWeight: "bold" },

  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1
  },

  noDataWrapper: {
    alignItems: "center",
    padding: 40
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)", // 0.2 is much lighter than 0.7
    justifyContent: "center", // or "flex-end" for bottom sheet
    margin: 10
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
    maxHeight: '90%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E293B"
  },
  modalSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2
  },
  closeCircle: {
    backgroundColor: '#F1F5F9',
    padding: 8,
    borderRadius: 20
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 6,
    marginLeft: 4
  },
  modernInput: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 15,
    color: "#1E293B"
  },
  modernPickerWrapper: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    overflow: 'hidden' // Important for rounded corners on Android

  },
  modalFooter: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 12
  },
  submitBtn: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8
  },
  submitBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
    textTransform: 'uppercase'
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#F1F5F9", // Light Slate
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0"
  },

  cancelBtnText: {
    color: "#64748B", // Muted Slate
    fontWeight: "700",
    fontSize: 15
  },



  uploadContainer: {
    marginTop: 15,
  },

  uploadBtn: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',   // 👈 dotted/dashed look
    borderRadius: 10,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },

  uploadText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '500',
  },

  fileBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#E0F2FE',
    borderRadius: 8,
  },

  fileText: {
    color: '#0369A1',
    fontSize: 13,
  },
  // Add these to your existing StyleSheet.create
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    alignItems: 'center', // Centers text and icons vertically
  },
  actionColumn: {
    flexDirection: 'row',
    width: 150,
    alignItems: 'center',
    gap: 6, // Adds space between the circle buttons
  },
  checkBg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#C026D3", // Purple/Pink
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadBg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#0EA5E9", // Blue
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F59E0B", // Orange
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#EF4444", // Red
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIconBase: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  tableTitle:
  {
    backgroundColor: "#2563EB",  // your desired color
    color: "#fff",               // text color
    paddingHorizontal: 8,        // horizontal padding
    paddingVertical: 1,          // vertical padding
    borderRadius: 4,
    width: '100%',
    height: 30,
    fontSize: 20,
    fontWeight: "bold",

    padding: 3,
    display: "flex",
    textAlign: "center",
    borderRadius: 12
  },
  search: {
    height: 40,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 10,
    paddingHorizontal: 10,
    backgroundColor: "gery"
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // 👉 RIGHT SIDE
    alignItems: 'center',
    marginTop: 10,
  },

  pageBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#2563EB',
    borderRadius: 6,
    marginHorizontal: 5,
  },

  disabledBtn: {
    backgroundColor: '#CBD5E1'
  },

  pageText: {
    color: '#fff',
    fontWeight: 'bold'
  },

  pageNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 5
  },
});