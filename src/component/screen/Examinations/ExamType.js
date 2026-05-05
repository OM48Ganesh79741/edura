import React, { useState, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Modal,
    Dimensions,
    StatusBar
} from 'react-native';
import Animated, {
    FadeInDown,
    FadeInRight,
    Layout,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    interpolate
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

// Custom Floating Label Input Component
const FloatingInput = ({ label, value, onChangeText, multiline = false }) => {
    const focusAnim = useSharedValue(value ? 1 : 0);

    const labelStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: interpolate(focusAnim.value, [0, 1], [0, -25]) },
            { scale: interpolate(focusAnim.value, [0, 1], [1, 0.85]) }
        ],
        color: focusAnim.value === 1 ? '#6366f1' : '#94a3b8'
    }));

    return (
        <View style={styles.inputContainer}>
            <Animated.Text style={[styles.floatingLabel, labelStyle]}>
                {label}
            </Animated.Text>
            <TextInput
                style={[styles.input, multiline && styles.textArea]}
                value={value}
                onChangeText={onChangeText}
                onFocus={() => (focusAnim.value = withTiming(1))}
                onBlur={() => !value && (focusAnim.value = withTiming(0))}
                multiline={multiline}
            />
        </View>
    );
};

const ExamType = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [examTypes, setExamTypes] = useState([
        { id: '1', name: '🏆 Final Semester', description: 'Main end-of-year evaluation', color: ['#6366f1', '#a855f7'] },
        { id: '2', name: '📝 Mid-Term', description: 'Half-yearly performance check', color: ['#f59e0b', '#ef4444'] },
    ]);

    const handleSave = () => {
        if (name.trim()) {
            const newEntry = {
                id: Date.now().toString(),
                name: `✨ ${name}`,
                description,
                color: ['#06b6d4', '#3b82f6'],
            };
            setExamTypes([newEntry, ...examTypes]);
            setName('');
            setDescription('');
            setModalVisible(false);
        }
    };

    const renderItem = ({ item, index }) => (
        <Animated.View
            entering={FadeInRight.delay(index * 100).springify()}
            layout={Layout.springify()}
            style={styles.card}
        >
            <LinearGradient colors={item.color} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardGradient}>
                <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardSubtitle}>{item.description}</Text>
                </View>
                <TouchableOpacity style={styles.arrowCircle}>
                    <Text style={{ color: '#fff', fontSize: 18 }}>→</Text>
                </TouchableOpacity>
            </LinearGradient>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <LinearGradient colors={['#0f172a', '#1e293b']} style={styles.headerBG}>
                <Animated.Text entering={FadeInDown.delay(200)} style={styles.mainTitle}>
                    Exam Center
                </Animated.Text>
                <Text style={styles.subHeader}>{examTypes.length} Active Modules</Text>
            </LinearGradient>

            <FlatList
                data={examTypes}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listPadding}
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => setModalVisible(true)}
            >
                <LinearGradient colors={['#6366f1', '#a855f7']} style={styles.fabGradient}>
                    <Text style={styles.fabText}>+</Text>
                </LinearGradient>
            </TouchableOpacity>

            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <Animated.View entering={FadeInDown.springify()} style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Create New Type</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                                <Text style={{ color: '#fff' }}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <FloatingInput label="Exam Title" value={name} onChangeText={setName} />
                        <FloatingInput label="Short Description" value={description} onChangeText={setDescription} multiline />

                        <TouchableOpacity onPress={handleSave} activeOpacity={0.8}>
                            <LinearGradient colors={['#6366f1', '#4f46e5']} style={styles.saveBtn}>
                                <Text style={styles.saveBtnText}>Confirm Details</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    headerBG: {
        paddingTop: 70,
        paddingBottom: 40,
        paddingHorizontal: 30,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    mainTitle: { fontSize: 32, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
    subHeader: { color: '#94a3b8', fontSize: 16, marginTop: 5, fontWeight: '500' },

    listPadding: { padding: 20, paddingBottom: 120 },
    card: {
        marginBottom: 16,
        borderRadius: 24,
        backgroundColor: '#fff',
        shadowColor: '#6366f1',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 20,
        elevation: 8,
    },
    cardGradient: {
        padding: 24,
        borderRadius: 24,
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardInfo: { flex: 1 },
    cardTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    cardSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 6 },
    arrowCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    fab: {
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center',
        width: 70,
        height: 70,
        borderRadius: 35,
        shadowColor: '#6366f1',
        shadowOpacity: 0.4,
        shadowRadius: 15,
        elevation: 10,
    },
    fabGradient: { flex: 1, borderRadius: 35, justifyContent: 'center', alignItems: 'center' },
    fabText: { color: '#fff', fontSize: 40, fontWeight: '200' },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        justifyContent: 'center',
        padding: 20
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 35,
        padding: 30,
        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowRadius: 20,
    },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40, alignItems: 'center' },
    modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#1e293b' },
    closeBtn: { backgroundColor: '#f1f5f9', padding: 8, borderRadius: 20, backgroundColor: '#ef4444' },

    inputContainer: { marginBottom: 35, position: 'relative' },
    floatingLabel: { position: 'absolute', left: 10, top: 15, fontSize: 16, fontWeight: '500' },
    input: {
        borderBottomWidth: 2,
        borderBottomColor: '#e2e8f0',
        paddingVertical: 10,
        paddingHorizontal: 10,
        fontSize: 16,
        color: '#1e293b',
    },
    textArea: { height: 80, textAlignVertical: 'top' },
    saveBtn: { padding: 18, borderRadius: 20, alignItems: 'center', marginTop: 10 },
    saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
});

export default ExamType;