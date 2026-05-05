import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, Animated, KeyboardAvoidingView,
  Platform, ScrollView, Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BASE_URL from '../Config';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const PeriodAttendanceByDate = () => {
  const [classList, setClassList] = useState([]);
  const [sectionList, setSectionList] = useState([]);

  // States for Selection
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState(new Date()); // Default current date
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchClass();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);


  // class fetch
  const fetchClass = async () => {
    try {
      const domainValue = await AsyncStorage.getItem('user_config');
      const res = await axios.get(`${BASE_URL}/class/uniqueclass`, {
        headers: { "Content-Type": "application/json", "domain": domainValue }
      });
      setClassList(res.data);
      console.log("unique class", res.data);

    } catch (error) {
      console.log("Class API Error:", error);
    }
  };


  // fetch sections
  const fetchSections = async (classId) => {
    console.log("classId", classId);

    try {
      const domainValue = await AsyncStorage.getItem('user_config');
      const res = await axios.get(`${BASE_URL}/classSections/SectionsByClass/${classId}`, {
        headers: { "Content-Type": "application/json", "domain": domainValue }

      });
      setSectionList(res.data);
      console.log("section List", res.data);

    } catch (error) {
      setSectionList([]);
    }
  };

  const handleSubmit = () => {
    const data = {
      classId: selectedClass,
      sectionId: selectedSection,
      subject: subject,
      date: date
    };
    console.log("Submitting Attendance for:", data);
    // Add your API call for attendance submission here
  };


  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);

    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          <Animated.View style={[styles.mainCard, { opacity: fadeAnim }]}>
            <View style={styles.header}>
              <Text style={styles.title}>Period Attendance</Text>
              <Text style={styles.subtitle}>Fill details to manage period records</Text>
            </View>

            <View style={styles.formContainer}>

              {/* CLASS PICKER */}
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Select Class</Text>
                <View style={styles.pickerWrapper}>

                  <Picker
                    selectedValue={selectedClass}
                    onValueChange={(val) => {
                      setSelectedClass(val);
                      setSelectedSection('');
                      if (val) fetchSections(val);
                    }}
                    style={styles.picker}
                    dropdownIconColor="#3b82f6"
                  >
                    <Picker.Item label="Choose Class..." value="" color="#94a3b8" />
                    {classList.map((item) => (
                      <Picker.Item key={item.id} label={item.Class} value={item.id} />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* SECTION PICKER */}
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Select Section</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={selectedSection}
                    onValueChange={(val) => setSelectedSection(val)}
                    style={styles.picker}
                    enabled={sectionList.length > 0}
                    dropdownIconColor="#3b82f6"
                  >
                    <Picker.Item label="Choose Section..." value="" color="#94a3b8" />
                    {sectionList.map((item) => (
                      <Picker.Item key={item.id} label={item.Section} value={item.id} />
                    ))}
                  </Picker>
                </View>
              </View>


              {/* DATE INPUT */}

              {/* DATE INPUT */}
              {/* DATE INPUT (MODERN STYLE) */}
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Date</Text>

                <TouchableOpacity
                  style={styles.modernInput}
                  onPress={() => setShowDatePicker(true)}
                >
                  <View style={styles.rowBetween}>
                    <Text style={styles.inputText}>
                      {date.toLocaleDateString('en-GB')}
                    </Text>

                    <Icon name="calendar-outline" size={20} color="#94a3b8" />
                  </View>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) setDate(selectedDate);
                    }}
                    maximumDate={new Date()}
                  />
                )}
              </View>

              {/* SUBMIT BUTTON */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.submitBtn}
                onPress={handleSubmit}
              >
                <Text style={styles.submitBtnText}>Search</Text>
              </TouchableOpacity>

            </View>
          </Animated.View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617', // Richer Dark background
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  mainCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: '#1e293b',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#f8fafc',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
  },
  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: 16,
  },
  label: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    marginLeft: 4,
  },
  textInput: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    color: '#f8fafc',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#334155',
  },
  pickerWrapper: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  picker: {
    color: '#f8fafc',
    height: Platform.OS === 'ios' ? 140 : 50,
  },
  submitBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 10,
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  modernInput: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#334155',
    justifyContent: 'center',
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  inputText: {
    color: '#f8fafc',
    fontSize: 15,
  },
});

export default PeriodAttendanceByDate;