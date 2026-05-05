import React, { useState, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, ActivityIndicator,
    ScrollView, SafeAreaView, StatusBar
} from 'react-native';

// import AssignTImetableTeacher from './AssignTImetableTeacher';
import { Picker } from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BASE_URL from '../../Config';



const AddClassTimetable = () => {
    const [activeSession, setActiveSession] = useState(null);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [subjectGroups, setSubjectGroups] = useState([]);
    const [finalSubjects, setFinalSubjects] = useState([]);


    const [selectedGroupId, setSelectedGroupId] = useState(null);

    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [selectedGroupName, setSelectedGroupName] = useState(null);

    const [teachers, setTeachers] = useState([]);
    const [loadingTeachers, setLoadingTeachers] = useState(false);

    const [loading, setLoading] = useState({
        session: true,
        class: false,
        section: false,
        group: false,
        subjects: false
    });

    const getHeaders = async () => {
        const domainValue = await AsyncStorage.getItem('user_config');
        return {
            "Content-Type": "application/json",
            "domain": domainValue
        };
    };

    useEffect(() => {
        fetchInitialData();

    }, []);


    useEffect(() => {
        if (selectedSection) {
            fetchTeachers();
        }
    }, [selectedSection]);



    // fetch All teacher
    const fetchTeachers = async () => {
        setLoadingTeachers(true);
        try {
            const headers = await getHeaders();
            const res = await axios.get(`${BASE_URL}/staff/StaffRole/Teacher`, { headers });
            setTeachers(res.data.data); // ✅ Aapka data res.data.data mein aa raha hai
        } catch (error) {
            console.log(error);
        }
        setLoadingTeachers(false); // ✅ 'set' ko 'setLoadingTeachers(false)' karein
    };


    // 1. SESSION + CLASS
    const fetchInitialData = async () => {
        try {

            const domainValue = await AsyncStorage.getItem('user_config');

            const headers = {
                "Content-Type": "application/json",
                "domain": domainValue
            };


            // multiple api call  and stored  session and classs res (call unique classs and session active)
            const [sessionRes, classRes] = await Promise.all([
                axios.get(`${BASE_URL}/Session/getSession`, { headers }),
                axios.get(`${BASE_URL}/class/Uniqueclass`, { headers })
            ]);

            // ✅ ACTIVE SESSION STORE
            const activeSession = sessionRes.data.find(s => s.is_active === true);
            setActiveSession(activeSession);
            console.log("active session: ", activeSession);


            // ✅ CLASS STORE
            setClasses(classRes.data);

        } catch (err) {
            console.log("Initial Error:", err);
        } finally {
            setLoading(prev => ({ ...prev, session: false }));
        }
    };



    // 2. CLASS CHANGE → SECTION
    const handleClassChange = async (classId) => {
        setSelectedClass(classId);
        setSelectedSection(null);
        setSelectedGroupName(null);
        setSections([]);
        setSubjectGroups([]);
        setFinalSubjects([]);

        if (!classId) return;

        setLoading(prev => ({ ...prev, section: true }));

        try {
            const headers = await getHeaders();

            const res = await axios.get(
                `${BASE_URL}/classSections/SectionsByClass/${classId}`,
                { headers }
            );

            setSections(res.data);

        } catch (err) {
            console.log("Section Error:", err);
        } finally {
            setLoading(prev => ({ ...prev, section: false }));
        }
    };

    // 3. SECTION CHANGE → SUBJECT GROUP
    // const handleSectionChange = async (sectionId) => {
    //     setSelectedSection(sectionId);
    //     setSelectedGroupName(null);
    //     setSubjectGroups([]);
    //     setFinalSubjects([]);

    //     if (!sectionId || !selectedClass || !activeSession) return;

    //     setLoading(prev => ({ ...prev, group: true }));

    //     try {
    //         const headers = await getHeaders();

    //         const url = `${BASE_URL}/subjectGroupClassSection/SubjectGroupByClassSection/${selectedClass}/${sectionId}/${activeSession.id}`;

    //         const res = await axios.get(url, { headers });

    //         if (res.data.success) {
    //             setSubjectGroups(res.data.data);
    //             console.log("subject groiups: ", res.data.data);

    //         }

    //     } catch (err) {
    //         console.log("Group Error:", err);
    //     } finally {
    //         setLoading(prev => ({ ...prev, group: false }));
    //     }
    // };



    const handleSectionChange = async (sectionId) => {
        setSelectedSection(sectionId);
        setSubjectGroups([]); // Reset previous groups
        setSelectedGroupId(null); // Reset selection

        if (!sectionId || !selectedClass || !activeSession) return;

        setLoading(prev => ({ ...prev, group: true }));

        try {
            const headers = await getHeaders();
            const url = `${BASE_URL}/subjectGroupClassSection/SubjectGroupByClassSection/${selectedClass}/${sectionId}/${activeSession.id}`;

            console.log("Requesting URL:", url); // For debugging

            const res = await axios.get(url, { headers });

            if (res.data.success) {
                setSubjectGroups(res.data.data);
            } else {
                // Agar success false hai toh list khali rakhein aur user ko message dikhayein
                setSubjectGroups([]);
                console.log("Backend Message:", res.data.message);
            }

        } catch (err) {
            // 404 error yahan catch hoga
            if (err.response && err.response.status === 404) {
                console.log("Data not found (404). Check if Subject Group is assigned to this class/section.");
            } else {
                console.log("Group Error:", err);
            }
            setSubjectGroups([]);
        } finally {
            setLoading(prev => ({ ...prev, group: false }));
        }
    };










    // 4. SUBJECT GROUP → SUBJECT LIST
    const fetchSubjects = async () => {
        if (!selectedGroupId) return;

        setLoading(prev => ({ ...prev, subjects: true }));

        try {
            const headers = await getHeaders();

            const url = `${BASE_URL}/subjectGroupSubjects/subjectGroupSubject/subjectsBySubjectGroup/${selectedGroupId}`;

            const res = await axios.get(url, { headers });

            setFinalSubjects(res.data);

        } catch (err) {
            console.log("Subjects Error:", err);
        } finally {
            setLoading(prev => ({ ...prev, subjects: false }));
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

            <ScrollView style={styles.container}>

                <View style={styles.mainCard}>

                    {/* HEADER */}
                    <View style={styles.cardHeaderContainer}>
                        <Text style={styles.cardHeaderTitle}>Subject Management</Text>

                        <View style={styles.sessionBadge}>
                            <Text style={styles.sessionText}>
                                {activeSession?.session || 'Loading...'}
                            </Text>
                        </View>
                    </View>

                    {/* CLASS + SECTION */}
                    <View style={styles.row}>

                        <View style={styles.flex1}>
                            <Text style={styles.label}>CLASS</Text>
                            <View style={styles.pickerWrapper}>
                                <Picker
                                    selectedValue={selectedClass}
                                    onValueChange={handleClassChange}
                                >
                                    <Picker.Item label="Select Class" value={null} />
                                    {classes.map(c => (
                                        <Picker.Item
                                            key={c.id}
                                            label={c.Class}
                                            value={c.id}
                                        />
                                    ))}
                                </Picker>
                            </View>
                        </View>

                        <View style={[styles.flex1, { marginLeft: 10 }]}>
                            <Text style={styles.label}>SECTION</Text>
                            <View style={styles.pickerWrapper}>
                                {loading.section ? (
                                    <ActivityIndicator />
                                ) : (
                                    <Picker
                                        selectedValue={selectedSection}
                                        onValueChange={handleSectionChange}
                                        enabled={!!selectedClass}
                                    >
                                        <Picker.Item label="Select Section" value={null} />
                                        {sections.map(s => (
                                            <Picker.Item
                                                key={s.id}
                                                label={s.Section}
                                                value={s.id}
                                            />
                                        ))}
                                    </Picker>
                                )}
                            </View>
                        </View>

                    </View>

                    {/* SUBJECT GROUP */}
                    <Text style={styles.label}>SUBJECT GROUP</Text>

                    <View style={styles.pickerWrapper}>
                        {loading.group ? (
                            <ActivityIndicator />
                        ) : (
                            <Picker
                                selectedValue={selectedGroupId}
                                onValueChange={setSelectedGroupId}
                            >
                                <Picker.Item label="Select Group" value={null} />

                                {subjectGroups.map((item, index) => (
                                    <Picker.Item
                                        key={index}
                                        label={item.subjectGroup.SubjectGroupName}
                                        value={item.subjectGroup.id}   // ✅ ID use karo
                                    />
                                ))}
                            </Picker>
                        )}
                    </View>

                    {/* BUTTON */}
                    <TouchableOpacity
                        style={[
                            styles.searchBtn,
                            // !selectedGroupName && styles.btnDisabled
                            !selectedGroupId && styles.btnDisabled
                        ]}
                        onPress={fetchSubjects}
                        // disabled={!selectedGroupName}
                        disabled={!selectedGroupId}
                    >
                        {loading.subjects ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <View style={styles.btnContent}>
                                <Ionicons name="search" size={18} color="#fff" />
                                <Text style={styles.btnText}>GET LIST</Text>
                            </View>
                        )}

                    </TouchableOpacity>

                </View>

                {/* SUBJECT LIST */}
                {finalSubjects.length > 0 && (
                    <View style={styles.listArea}>
                        <Text style={styles.listTitle}>
                            Subjects ({finalSubjects.length})
                        </Text>

                        {finalSubjects.map((sub, i) => (
                            <View key={i} style={styles.subjectItem}>
                                <Ionicons name="book" size={20} color="#4F46E5" />
                                <View style={{ marginLeft: 10 }}>
                                    <Text style={styles.subjectName}>
                                        {sub.SubjectName}
                                    </Text>
                                    <Text style={styles.subjectCode}>
                                        {sub.SubjectCode} • {sub.SubjectType}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

            </ScrollView>
            {/* <AssignTImetableTeacher></AssignTImetableTeacher> */}
        </SafeAreaView>
    );
};



const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
    container: { flex: 1, paddingHorizontal: 15 },
    mainCard: { backgroundColor: '#FFF', borderRadius: 18, padding: 15, marginTop: 20, elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, borderWidth: 1, borderColor: '#F1F5F9' },
    cardHeaderContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 10 },
    cardHeaderTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
    sessionBadge: { backgroundColor: '#EEF2FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    sessionText: { fontSize: 11, color: '#4F46E5', fontWeight: '700' },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    flex1: { flex: 1 },
    label: { fontSize: 10, fontWeight: '800', color: '#94A3B8', marginBottom: 5, marginTop: 10, letterSpacing: 0.5 },
    pickerWrapper: { backgroundColor: '#F8FAFC', borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', height: 45, justifyContent: 'center' },
    searchBtn: { backgroundColor: '#4F46E5', height: 48, borderRadius: 10, marginTop: 20, justifyContent: 'center', alignItems: 'center' },
    btnContent: { flexDirection: 'row', alignItems: 'center' },
    btnDisabled: { backgroundColor: '#C7D2FE' },
    btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14, marginLeft: 8 },
    listArea: { marginTop: 20 },
    listTitle: { fontSize: 16, fontWeight: '700', color: '#334155', marginBottom: 12 },
    subjectItem: { backgroundColor: '#FFF', padding: 12, borderRadius: 12, marginBottom: 8, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' },
    iconBox: { backgroundColor: '#F5F7FF', padding: 8, borderRadius: 8, marginRight: 12 },
    subjectName: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
    subjectCode: { fontSize: 11, color: '#64748B', marginTop: 2 }
});

export default AddClassTimetable;