import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';

const AddStaff = () => {
  const [formData, setFormData] = useState({});

  console.log("SUCCESS: AddStaff screen is now running!");

  const FormInput = ({ label, placeholder, required }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>
        {label} {required && <Text style={{ color: 'red' }}>*</Text>}
      </Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        onChangeText={(text) => 
          setFormData({ 
            ...formData, 
            [label.replace(/\s/g, '')]: text 
          })
        }
      />
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Add Staff</Text>
        <TouchableOpacity style={styles.importButton}>
          <Text style={styles.importButtonText}>+ Import Staff</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>Basic Information</Text>

        <View style={styles.row}><FormInput label="Role" placeholder="Select" required /><FormInput label="Designation" placeholder="Select" required /></View>
        <View style={styles.row}><FormInput label="Department" placeholder="Select" required /><FormInput label="Registration No" required /></View>
        <View style={styles.row}><FormInput label="First Name" required /><FormInput label="Last Name" required /></View>
        <View style={styles.row}><FormInput label="Father Name" required /><FormInput label="Mother Name" required /></View>
        <View style={styles.row}><FormInput label="Gender" placeholder="Select" required /><FormInput label="Date of Birth" placeholder="dd-mm-yyyy" required /></View>
        <View style={styles.row}><FormInput label="Category" placeholder="Select" required /><FormInput label="Caste" placeholder="Select" required /></View>
        <View style={styles.row}><FormInput label="Email" placeholder="Login Username" required /><FormInput label="Mobile No" required /></View>

        <TouchableOpacity 
            style={[styles.submitButton, { backgroundColor: 'red' }]}
             onPress={() => {
    alert("Pressed ✅");
  }}
>
  <Text style={styles.submitButtonText}>Submit</Text>
</TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AddStaff;

// ✅ NO CHANGE IN STYLES
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  scrollContent: { padding: 15, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  headerText: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  importButton: { backgroundColor: '#1a1d23', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 6 },
  importButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  formCard: { backgroundColor: '#fff', borderRadius: 12, padding: 15, elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15, color: '#444' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  inputContainer: { width: '48%' },
  label: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 5 },
  input: { height: 42, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, backgroundColor: '#f9f9f9' },
  submitButton: { backgroundColor: '#28a745', paddingVertical: 12, borderRadius: 10, marginTop: 20, alignItems: 'center' },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  submitButton: { 
  backgroundColor: '#28a745', 
  paddingVertical: 12, 
  borderRadius: 10, 
  marginTop: 20, 
  alignItems: 'center',
  zIndex: 999
}
});