// import React, { useState, useEffect } from 'react';
// import {
//     View,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     FlatList,
//     StyleSheet,
//     ActivityIndicator,
//     Alert,
//     SafeAreaView,
// } from 'react-native';

// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


// const SectionManager = ({ navigation }) => {
//     const [sectionName, setSectionName] = useState('');
//     const [sections, setSections] = useState([]);
//     const [filteredSections, setFilteredSections] = useState([]);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         fetchSections();
//     }, []);

//     // GET: Fetch all sections
//     const fetchSections = async () => {
//         setLoading(true);
//         try {
//             const response = await fetch('https://api.adivasiunnati.com/section/section');
//             const data = await response.json();
//             setSections(data);
//             setFilteredSections(data);
//         } catch (error) {
//             Alert.alert('Error', 'Failed to fetch sections');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // POST: Add new section
//     const handleSave = async () => {
//         if (!sectionName.trim()) {
//             Alert.alert('Validation', 'Please enter a section name');
//             return;
//         }

//         try {
//             const response = await fetch('https://api.adivasiunnati.com/section/addSection', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ Section: sectionName }),
//             });

//             if (response.ok) {
//                 Alert.alert('Success', 'Section added successfully');
//                 setSectionName('');
//                 fetchSections(); // Refresh list
//             }
//         } catch (error) {
//             Alert.alert('Error', 'Failed to save section');
//         }
//     };

//     // Search Logic
//     const handleSearch = (text) => {
//         setSearchQuery(text);
//         const filtered = sections.filter((item) =>
//             item.Section.toLowerCase().includes(text.toLowerCase())
//         );
//         setFilteredSections(filtered);
//     };

//     const renderItem = ({ item }) => (
//         <View style={styles.tableRow}>
//             <Text style={styles.cellText}>{item.Section}</Text>
//             <View style={styles.actionGroup}>
//                 <TouchableOpacity style={styles.editBtn}>
//                     <Ionicons name="pencil" size={18} color="#fff" />
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.deleteBtn}>
//                     <Ionicons name="trash" size={18} color="#fff" />
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );

//     return (
//         <SafeAreaView style={styles.container}>
//             {/* Header with Back Arrow */}
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//                     <Ionicons name="arrow-back" size={24} color="#1e293b" />
//                 </TouchableOpacity>
//                 <Text style={styles.headerTitle}>Section Management</Text>
//             </View>

//             {/* Add Section Card */}
//             <View style={styles.card}>
//                 <Text style={styles.cardTitle}>Add Section</Text>
//                 <Text style={styles.label}>Section<Text style={{ color: 'red' }}>*</Text></Text>
//                 <TextInput
//                     style={styles.input}
//                     placeholder="Enter Section Name"
//                     value={sectionName}
//                     onChangeText={setSectionName}
//                 />
//                 <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
//                     <Text style={styles.saveButtonText}>Save</Text>
//                 </TouchableOpacity>
//             </View>

//             {/* Section List Card */}
//             <View style={[styles.card, { flex: 1 }]}>
//                 <View style={styles.listHeader}>
//                     <Text style={styles.cardTitle}>Section List</Text>
//                     <TextInput
//                         style={styles.searchInput}
//                         placeholder="Search..."
//                         value={searchQuery}
//                         onChangeText={handleSearch}
//                     />
//                 </View>

//                 {/* Table Header */}
//                 <View style={styles.tableHeader}>
//                     <Text style={styles.headerCell}>Section</Text>
//                     <Text style={[styles.headerCell, { textAlign: 'right' }]}>Action</Text>
//                 </View>

//                 {loading ? (
//                     <ActivityIndicator color="#1e293b" style={{ marginTop: 20 }} />
//                 ) : (
//                     <FlatList
//                         data={filteredSections}
//                         keyExtractor={(item) => item.id.toString()}
//                         renderItem={renderItem}
//                         contentContainerStyle={{ paddingBottom: 20 }}
//                     />
//                 )}
//             </View>
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#f1f5f9' },
//     header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 16,
//         backgroundColor: '#fff',
//         elevation: 2,
//     },
//     headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 16, color: '#1e293b' },
//     card: {
//         backgroundColor: '#fff',
//         margin: 12,
//         padding: 16,
//         borderRadius: 12,
//         elevation: 3,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//     },
//     cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15, color: '#334155' },
//     label: { fontSize: 14, color: '#64748b', marginBottom: 5 },
//     input: {
//         borderWidth: 1,
//         borderColor: '#cbd5e1',
//         borderRadius: 8,
//         padding: 10,
//         fontSize: 16,
//         backgroundColor: '#f8fafc',
//     },
//     saveButton: {
//         backgroundColor: '#1e293b',
//         padding: 12,
//         borderRadius: 8,
//         alignSelf: 'flex-end',
//         marginTop: 15,
//         minWidth: 100,
//         alignItems: 'center',
//     },
//     saveButtonText: { color: '#fff', fontWeight: 'bold' },
//     listHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 10,
//     },
//     searchInput: {
//         width: '50%',
//         borderWidth: 1,
//         borderColor: '#cbd5e1',
//         borderRadius: 8,
//         paddingHorizontal: 10,
//         height: 40,
//     },
//     tableHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         paddingVertical: 10,
//         borderBottomWidth: 1,
//         borderBottomColor: '#e2e8f0',
//         backgroundColor: '#f8fafc',
//         paddingHorizontal: 8,
//     },
//     headerCell: { fontWeight: 'bold', color: '#475569', flex: 1 },
//     tableRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingVertical: 12,
//         borderBottomWidth: 1,
//         borderBottomColor: '#f1f5f9',
//         paddingHorizontal: 8,
//     },
//     cellText: { fontSize: 16, color: '#1e293b', flex: 1 },
//     actionGroup: { flexDirection: 'row', gap: 8 },
//     editBtn: { backgroundColor: '#f59e0b', padding: 6, borderRadius: 6 },
//     deleteBtn: { backgroundColor: '#ef4444', padding: 6, borderRadius: 6 },
// });

// export default SectionManager;









import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Alert,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// 🌐 API Configuration
import BASE_URL from '../../Config';

const SectionManager = ({ navigation }) => {
    const [sectionName, setSectionName] = useState('');
    const [sections, setSections] = useState([]);
    const [filteredSections, setFilteredSections] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSections();
    }, []);

    // Helper to get domain from storage
    const getDomain = async () => {
        try {
            const domainValue = await AsyncStorage.getItem('user_config');
            return domainValue;
        } catch (error) {
            console.error("Storage Error:", error);
            return null;
        }
    };

    // GET: Fetch all sections
    const fetchSections = async () => {
        setLoading(true);
        try {
            const domain = await getDomain();
            const response = await axios.get(`${BASE_URL}/section/section`, {
                headers: {
                    "Content-Type": "application/json",
                    "domain": domain
                }
            });
            setSections(response.data);
            setFilteredSections(response.data);
        } catch (error) {
            console.log("Fetch Error:", error);
            Alert.alert('Error', 'Failed to fetch sections');
        } finally {
            setLoading(false);
        }
    };

    // POST: Add new section
    const handleSave = async () => {
        if (!sectionName.trim()) {
            Alert.alert('Validation', 'Please enter a section name');
            return;
        }

        try {
            const domain = await getDomain();
            const response = await axios.post(`${BASE_URL}/section/addSection`,
                { Section: sectionName },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "domain": domain
                    }
                }
            );

            if (response.status === 200 || response.status === 201) {
                Alert.alert('Success', 'Section added successfully ✨');
                setSectionName('');
                fetchSections();
            }
        } catch (error) {
            console.log("Save Error:", error);
            Alert.alert('Error', 'Failed to save section');
        }
    };

    const handleSearch = (text) => {
        setSearchQuery(text);
        const filtered = sections.filter((item) =>
            item.Section.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredSections(filtered);
    };

    const renderItem = ({ item, index }) => (
        <View style={styles.tableRow}>
            <View style={styles.sectionInfo}>
                <View style={styles.indexBadge}>
                    <Text style={styles.indexText}>{index + 1}</Text>
                </View>
                <Text style={styles.cellText}>{item.Section}</Text>
            </View>
            <View style={styles.actionGroup}>
                <TouchableOpacity style={styles.editBtn}>
                    <Ionicons name="pencil" size={16} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn}>
                    <Ionicons name="trash" size={16} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#2563EB" barStyle="light-content" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Section Management</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Create New Section</Text>
                <View style={styles.inputContainer}>
                    <Ionicons name="layers-outline" size={20} color="#64748b" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Section A"
                        placeholderTextColor="#94a3b8"
                        value={sectionName}
                        onChangeText={setSectionName}
                    />
                </View>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8}>
                    <Ionicons name="add-circle" size={20} color="#fff" />
                    <Text style={styles.saveButtonText}>Add Section</Text>
                </TouchableOpacity>
            </View>

            <View style={[styles.card, { flex: 1, marginBottom: 20 }]}>
                <View style={styles.listHeader}>
                    <Text style={styles.cardTitle}>All Sections</Text>
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={18} color="#64748b" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search..."
                            value={searchQuery}
                            onChangeText={handleSearch}
                        />
                    </View>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 40 }} />
                ) : (
                    <FlatList
                        data={filteredSections}
                        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>No sections found.</Text>
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 16,
        backgroundColor: '#2563EB',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        elevation: 8,
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
    },
    headerTitle: { fontSize: 20, fontWeight: '700', marginLeft: 12, color: '#fff' },
    card: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginTop: 16,
        padding: 20,
        borderRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
    },
    cardTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 15 },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        borderRadius: 12,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, height: 50, fontSize: 16, color: '#1e293b' },
    saveButton: {
        flexDirection: 'row',
        backgroundColor: '#2563EB',
        paddingVertical: 14,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        gap: 8,
    },
    saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        borderRadius: 10,
        paddingHorizontal: 10,
        width: '55%',
        height: 40,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    searchInput: { flex: 1, fontSize: 14, marginLeft: 5, color: '#1e293b' },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    sectionInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    indexBadge: {
        backgroundColor: '#EFF6FF',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    indexText: { color: '#2563EB', fontWeight: 'bold', fontSize: 13 },
    cellText: { fontSize: 16, fontWeight: '500', color: '#334155' },
    actionGroup: { flexDirection: 'row', gap: 10 },
    editBtn: { backgroundColor: '#F59E0B', padding: 8, borderRadius: 10 },
    deleteBtn: { backgroundColor: '#EF4444', padding: 8, borderRadius: 10 },
    emptyText: { textAlign: 'center', color: '#94a3b8', marginTop: 20 },
});

export default SectionManager;