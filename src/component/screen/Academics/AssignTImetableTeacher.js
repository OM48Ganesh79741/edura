import React, { useState } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, StyleSheet,
    Modal, TextInput, FlatList, Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AssignTImetableTeacher = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const [selectedDay, setSelectedDay] = useState('Monday');
    const [isModalVisible, setModalVisible] = useState(false);

    // Main State for Timetable Data
    const [dayWiseTimetable, setDayWiseTimetable] = useState({
        Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []
    });

    // Modal temporary form state
    const [tempRows, setTempRows] = useState([]);

    // 1. Open Modal for a specific day
    const openTimetableModal = (day) => {
        setSelectedDay(day);
        // Pehle se agar us din ka data hai toh modal mein dikhayein
        setTempRows([...dayWiseTimetable[day]]);
        setModalVisible(true);
    };

    // 2. Add New Row inside Modal
    const addNewRow = () => {
        const newRow = {
            id: Date.now().toString(),
            subject: '',
            teacher: '',
            startTime: '',
            endTime: '',
            roomNumber: ''
        };
        setTempRows([...tempRows, newRow]);
    };

    // 3. Update Input in specific row
    const updateRowValue = (id, field, value) => {
        const updated = tempRows.map(row =>
            row.id === id ? { ...row, [field]: value } : row
        );
        setTempRows(updated);
    };

    // 4. Remove Row
    const removeRow = (id) => {
        setTempRows(tempRows.filter(row => row.id !== id));
    };

    // 5. Save Modal Data to Main State
    const saveDayTimetable = () => {
        setDayWiseTimetable({
            ...dayWiseTimetable,
            [selectedDay]: tempRows
        });
        setModalVisible(false);
        Alert.alert("Success", `${selectedDay} timetable updated locally!`);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Class Timetable</Text>

            {/* HORIZONTAL DAY LIST */}
            <View style={styles.dayPickerContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 15 }}>
                    {days.map((day) => (
                        <TouchableOpacity
                            key={day}
                            style={[
                                styles.dayButton,
                                selectedDay === day && styles.activeDayButton
                            ]}
                            onPress={() => openTimetableModal(day)}
                        >
                            <Text style={[
                                styles.dayText,
                                selectedDay === day && styles.activeDayText
                            ]}>
                                {day}
                            </Text>
                            {dayWiseTimetable[day].length > 0 && (
                                <View style={styles.dotIndicator} />
                            )}
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <Text style={styles.hintText}>Tap on a day to add/edit timetable</Text>

            {/* TIMETABLE MODAL */}
            <Modal visible={isModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{selectedDay} Schedule</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close-circle" size={30} color="#64748B" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.addBtn} onPress={addNewRow}>
                            <Ionicons name="add" size={20} color="#fff" />
                            <Text style={styles.btnText}>Add Subject</Text>
                        </TouchableOpacity>

                        <FlatList
                            data={tempRows}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <View style={styles.rowCard}>
                                    <View style={styles.rowTop}>
                                        <TextInput
                                            style={[styles.input, { flex: 1, marginRight: 5 }]}
                                            placeholder="Subject"
                                            value={item.subject}
                                            onChangeText={(val) => updateRowValue(item.id, 'subject', val)}
                                        />
                                        <TextInput
                                            style={[styles.input, { flex: 1 }]}
                                            placeholder="Teacher"
                                            value={item.teacher}
                                            onChangeText={(val) => updateRowValue(item.id, 'teacher', val)}
                                        />
                                    </View>
                                    <View style={styles.rowBottom}>
                                        <TextInput
                                            style={[styles.input, { width: '30%' }]}
                                            placeholder="09:00 AM"
                                            value={item.startTime}
                                            onChangeText={(val) => updateRowValue(item.id, 'startTime', val)}
                                        />
                                        <TextInput
                                            style={[styles.input, { width: '30%' }]}
                                            placeholder="10:00 AM"
                                            value={item.endTime}
                                            onChangeText={(val) => updateRowValue(item.id, 'endTime', val)}
                                        />
                                        <TextInput
                                            style={[styles.input, { width: '25%' }]}
                                            placeholder="Room"
                                            value={item.roomNumber}
                                            onChangeText={(val) => updateRowValue(item.id, 'roomNumber', val)}
                                        />
                                        <TouchableOpacity onPress={() => removeRow(item.id)} style={styles.deleteBtn}>
                                            <Ionicons name="trash" size={20} color="#EF4444" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        />

                        <TouchableOpacity style={styles.saveBtn} onPress={saveDayTimetable}>
                            <Text style={styles.btnText}>SAVE {selectedDay.toUpperCase()}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC', paddingTop: 50 },
    headerTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: '#1E293B' },
    dayPickerContainer: { marginVertical: 20 },
    dayButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#FFF',
        borderRadius: 12,
        marginRight: 10,
        alignItems: 'center',
        elevation: 2,
        borderWidth: 1,
        borderColor: '#E2E8F0'
    },
    activeDayButton: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
    dayText: { color: '#64748B', fontWeight: '700' },
    activeDayText: { color: '#FFF' },
    dotIndicator: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981', marginTop: 4 },
    hintText: { textAlign: 'center', color: '#94A3B8', fontSize: 12 },

    // Modal Styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
        height: '85%'
    },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1E293B' },
    rowCard: {
        backgroundColor: '#F1F5F9',
        padding: 12,
        borderRadius: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#CBD5E1'
    },
    rowTop: { flexDirection: 'row', marginBottom: 8 },
    rowBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    input: {
        backgroundColor: '#FFF',
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        fontSize: 13
    },
    addBtn: {
        backgroundColor: '#10B981',
        flexDirection: 'row',
        padding: 12,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15
    },
    saveBtn: {
        backgroundColor: '#4F46E5',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10
    },
    btnText: { color: '#FFF', fontWeight: 'bold', marginLeft: 5 },
    deleteBtn: { padding: 5 }
});

export default AssignTImetableTeacher;

























