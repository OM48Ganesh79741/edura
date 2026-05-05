import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/Ionicons";

const StaffAttendance = () => {

  const [role, setRole] = useState("All");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [holiday, setHoliday] = useState(false);

  const formatDate = (d) => {
    return d.toISOString().split("T")[0];
  };

  const onChangeDate = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <Text style={styles.header}>Select Criteria</Text>

      <View style={styles.card}>

        {/* Role */}
        <View style={styles.field}>
          <Text style={styles.label}>Role *</Text>

          <View style={styles.inputBox}>
            <Picker
              selectedValue={role}
              onValueChange={(itemValue) => setRole(itemValue)}
            >
              <Picker.Item label="All" value="All" />
              <Picker.Item label="Teacher" value="Teacher" />
              <Picker.Item label="Admin" value="Admin" />
            </Picker>
          </View>
        </View>

        {/* Date Picker */}
        <View style={styles.field}>
          <Text style={styles.label}>Attendance Date *</Text>

          <TouchableOpacity
            style={styles.dateBox}
            onPress={() => setShowPicker(true)}
          >
            <Text style={styles.dateText}>{formatDate(date)}</Text>
            <Icon name="calendar-outline" size={20} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <TouchableOpacity style={styles.searchBtn}>
          <Text style={styles.btnText}>Search</Text>
        </TouchableOpacity>

      </View>

      {/* Staff List */}
      <Text style={styles.header}>Staff List</Text>

      <View style={styles.actionRow}>

        <TouchableOpacity
          style={styles.holidayBtn}
          onPress={() => setHoliday(!holiday)}
        >
          <Icon
            name={holiday ? "checkbox" : "square-outline"}
            size={20}
            color="white"
          />
          <Text style={styles.btnText}> Mark As Holiday</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: "row" }}>

          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.btnText}>Show Attendance</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.btnText}>Save Attendance</Text>
          </TouchableOpacity>

        </View>

      </View>

      <Text style={styles.dateLabel}>
        Attendance Date: {formatDate(date)}
      </Text>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={styles.col}>Staff Id</Text>
        <Text style={styles.col}>Name</Text>
        <Text style={styles.col}>Role</Text>
        <Text style={styles.col}>Attendance</Text>
        <Text style={styles.col}>Note</Text>
      </View>

      <View style={styles.noData}>
        <Text style={{ color: "#64748b", fontSize: 16 }}>
          No Data Available
        </Text>
      </View>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

    </ScrollView>
  );
};

export default StaffAttendance;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 16
  },

  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12
  },

  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3
  },

  field: {
    marginBottom: 15
  },

  label: {
    fontSize: 14,
    marginBottom: 6
  },

  inputBox: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8
  },

  dateBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    padding: 12,
    borderRadius: 8
  },

  dateText: {
    fontSize: 15
  },

  searchBtn: {
    backgroundColor: "#1e293b",
    padding: 12,
    borderRadius: 8,
    alignItems: "center"
  },

  btnText: {
    color: "white",
    fontWeight: "600"
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },

  holidayBtn: {
    flexDirection: "row",
    backgroundColor: "#1e293b",
    padding: 10,
    borderRadius: 8
  },

  actionBtn: {
    backgroundColor: "#1e293b",
    padding: 10,
    borderRadius: 8,
    marginLeft: 10
  },

  dateLabel: {
    marginBottom: 10,
    fontWeight: "500"
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e2e8f0",
    padding: 12,
    borderRadius: 6
  },

  col: {
    flex: 1,
    fontWeight: "bold"
  },

  noData: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "white",
    marginTop: 5,
    borderRadius: 6
  }

});