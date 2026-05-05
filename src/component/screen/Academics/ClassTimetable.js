import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet,
    Dimensions, ScrollView, Animated, StatusBar
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../../Config';

import Dashboard from '../Dashboard/Dashboard'

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ClassTimetable = ({ navigation }) => {

    const [showTable, setShowTable] = useState(false);
    const [classList, setClassList] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [sectionList, setSectionList] = useState([]);
    const [selectedSection, setSelectedSection] = useState('');

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => { fetchClass(); }, []);

    // fetch class
    const fetchClass = async () => {
        try {
            const domainValue = await AsyncStorage.getItem('user_config');
            const res = await axios.get(`${BASE_URL}/class/uniqueclass`, {
                headers: { "Content-Type": "application/json", "domain": domainValue }
            });
            setClassList(res.data);
        } catch (error) { console.log("Class API Error:", error); }
    };

    // fetch section
    const fetchSections = async (classId) => {
        console.log("classId in section: ", classId);

        try {
            const domainValue = await AsyncStorage.getItem('user_config');
            const res = await axios.get(`${BASE_URL}/classSections/SectionsByClass/${classId}`,
                { headers: { "Content-Type": "application/json", "domain": domainValue } }
            );

            console.log("Section API Response:", res.data);
            setSectionList(res.data);

        } catch (error) {
            console.log("Section API Error:", error);
            setSectionList([]);
        }
    };

    // get active session
    const getActiveSessionId = async () => {
        try {
            const domainValue = await AsyncStorage.getItem('user_config');

            // ✅ सही API (session fetch करने के लिए)
            const res = await axios.get(`${BASE_URL}/Session/getSession`, {
                headers: {
                    "Content-Type": "application/json",
                    "domain": domainValue
                }
            });

            console.log("Session API:", res.data);

            const activeSession = res.data.find(item => item.is_active === true);

            return activeSession ? activeSession.id : null;

        } catch (error) {
            console.log("Session api error: ", error);
            return null;
        }
    };


    // search button
    const handleSearch = async () => {

        if (!selectedClass || !selectedSection) {
            alert("Please select class and section");
            return;
        }

        const sessionId = await getActiveSessionId();

        console.log("Class:", selectedClass);
        console.log("Section:", selectedSection);
        console.log("Session:", sessionId);

        if (!sessionId) {
            alert("No active session found");
            return;
        }

        try {
            const domainValue = await AsyncStorage.getItem('user_config');

            const res = await axios.get(
                `${BASE_URL}/timetable/GetTimetableByClassSection/Class/${selectedClass}/Section/${selectedSection}/SessionId/${sessionId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "domain": domainValue
                    }
                }
            );

            console.log("Timetable Data:", res.data);

        } catch (error) {
            console.log("Timetable API Error:", error.response?.data || error.message);
        }

        setShowTable(true);
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#F0F2F5' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={styles.backCircle}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.heading}>✨ Timetable ✨</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.searchBox}>
                    <View style={styles.rowHeader}>
                        <Text style={styles.mainLabel}>Select Criteria</Text>
                        <TouchableOpacity style={styles.addButtonInline}
                            onPress={() =>
                                navigation.navigate('AddClassTimetable')
                            }
                        >

                            <Text style={styles.addButtonText}>+ Add</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.inputLabel}>Class</Text>
                    <View style={styles.inputField}>
                        <Picker
                            selectedValue={selectedClass}
                            onValueChange={(value) => {
                                setSelectedClass(value);
                                if (value) fetchSections(value);
                                setSelectedSection('');
                            }}
                        >
                            <Picker.Item label="Select Class" value="" />
                            {classList.map((item, index) => (
                                <Picker.Item key={index} label={item.Class} value={item.id} />
                            ))}
                        </Picker>
                    </View>

                    <Text style={styles.inputLabel}>Section</Text>
                    <View style={styles.inputField}>
                        <Picker
                            selectedValue={selectedSection}
                            onValueChange={(value) => setSelectedSection(value)}
                        >
                            <Picker.Item label="Select Section" value="" />
                            {sectionList.map((item, index) => (
                                <Picker.Item
                                    key={index}
                                    label={item.sectionName || item.Section || item.section || item.name || "Unknown"}
                                    value={item.sectionId || item.id || item.section}
                                />
                            ))}
                        </Picker>
                    </View>

                    <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                        <Text style={styles.searchButtonText}>SEARCH SCHEDULE</Text>
                    </TouchableOpacity>
                </View>

                {showTable && (
                    <Animated.View style={[styles.tableContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                        <View style={styles.tableHeader}>
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                <View key={day} style={styles.headerCell}><Text style={styles.headerText}>{day}</Text></View>
                            ))}
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.noScheduleText}>📅 No classes for {selectedClass} {selectedSection}</Text>
                        </View>
                    </Animated.View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 12,
        backgroundColor: '#fff',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    backCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3E8FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: {
        fontSize: 24,
        color: '#6200ee',
        fontWeight: 'bold',
        marginTop: -2,
    },
    heading: {
        fontSize: 20,
        fontWeight: '900',
        color: '#6200ee'
    },
    scrollContainer: { padding: 20 },
    searchBox: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        elevation: 5
    },
    inputLabel: { fontSize: 13, marginBottom: 5, color: '#666', fontWeight: '600' },
    inputField: {
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 12,
        marginBottom: 15,
        backgroundColor: '#F9F9F9'
    },
    searchButton: {
        backgroundColor: '#6200ee',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#6200ee',
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5
    },
    searchButtonText: { color: '#fff', fontWeight: 'bold', letterSpacing: 1 },
    tableContainer: { marginTop: 20, backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden' },
    tableHeader: { flexDirection: 'row', backgroundColor: '#6200ee', padding: 15 },
    headerCell: { flex: 1, alignItems: 'center' },
    headerText: { color: '#fff', fontSize: 12, fontWeight: '700' },
    tableRow: { padding: 30, alignItems: 'center' },
    noScheduleText: { color: '#888', fontStyle: 'italic' },
    rowHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    mainLabel: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    addButtonInline: { backgroundColor: '#6200ee', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    addButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' }
});

export default ClassTimetable;