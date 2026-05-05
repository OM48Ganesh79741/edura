import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import BASE_URL from "../../Config";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get("window");

const StaffDirectory = ({ navigation }) => {

  const [keyword, setKeyword] = useState("");

  const [role, setRole] = useState("");   // ✔ correct
  const [roles, setRoles] = useState([]);
  const [filterAdmin, setfilteradmin] = useState([]);

  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [sessions, setSessions] = useState([]);


  const [selectedSession, setSelectedSession] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");


  useEffect(() => {
    getSessions();
    getinstituteRole();
  }, [])



  // get Role and remove super admin role
  const getinstituteRole = async () => {
    try {

      let domainValue = await AsyncStorage.getItem('user_config');
      console.log(domainValue);

      let res = await axios.get(`${BASE_URL}/instituteRole`,
        {
          headers: {
            "Content-Type": "application/json",
            "domain": domainValue
          }
        }
      );
      console.log("institude role : ", res.data);
      setRoles(res.data);

      //remove super admin role
      let filterAdmin = res.data.filter((x) => {
        if (x.name != 'Superadmin') {
          return x;
        }
      })
      console.log("filter without superAdmin: ", filterAdmin);

      setfilteradmin(filterAdmin);
      console.log(filterAdmin);




    }
    catch (error) {
      console.log(error);

    }
  }

  // getsessions
  const getSessions = async () => {
    try {

      // 🔥 domain local storage से लो
      const domainValue = await AsyncStorage.getItem('user_config');
      console.log(domainValue);


      console.log("Domain:", domainValue);

      const res = await axios.get(
        `${BASE_URL}/Session/getSession`,
        {
          headers: {
            "Content-Type": "application/json",
            "domain": domainValue   // ✅ यहाँ भेजा
          }
        }
      );

      setSessions(res.data);
      console.log(res.data);

    } catch (err) {
      console.log("Session Error:", err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* 1. Dynamic Top Header Section */}
      <View style={styles.topDecorativeHeader}>
        <View style={styles.headerNav}>
          <TouchableOpacity
            style={styles.backButtonCircle}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.topAddButton}
            onPress={() => navigation.navigate("AddStaff")}
          >
            <Icon name="person-add" size={18} color="#0ea5e9" />
            <Text style={styles.topAddText}>Add Staff</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.headerTextContainer}>
          <Text style={styles.welcomeTitle}>Staff Directory</Text>
          <Text style={styles.welcomeSubtitle}>Manage and search your team</Text>
        </View>
      </View>

      {/* 2. Floating Search Card */}
      <View style={styles.content}>
        <View style={styles.floatingCard}>
          <Text style={styles.cardTitle}>Filter Search</Text>

          {/* Role Picker */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>Staff Role</Text>
            <View style={styles.pickerContainer}>

              {/* display roles */}
              <Picker
                selectedValue={role}
                onValueChange={(itemValue) => setRole(itemValue)}
                style={styles.pickerStyle}
              >
                <Picker.Item label="All Roles" value="" />
                {
                  filterAdmin.map((item) => {
                    return (
                      <Picker.Item
                        key={item.id}
                        label={item.name}
                        value={item.name}
                      />)
                  })
                }


              </Picker>

            </View>
          </View>

          {/* Keyword Input */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>Search Keyword</Text>
            <View style={styles.inputContainer}>
              <Icon name="search-outline" size={20} color="#94a3b8" style={styles.searchIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Name, ID or Email..."
                placeholderTextColor="#94a3b8"
                value={keyword}
                onChangeText={setKeyword}
              />
            </View>
          </View>

          {/* Search Action */}
          <TouchableOpacity style={styles.primarySearchBtn} activeOpacity={0.8}>
            <Text style={styles.primarySearchBtnText}>Search Directory</Text>
          </TouchableOpacity>
        </View>

        {/* Info Tip */}
        <View style={styles.hintContainer}>
          <Icon name="bulb-outline" size={18} color="#64748b" />
          <Text style={styles.hintText}>
            Use keywords for faster results or filter by role.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  // Blue Header Background
  topDecorativeHeader: {
    backgroundColor: "#0F172A", // Dark Slate/Navy
    height: 220,
    paddingHorizontal: 20,
    paddingTop: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  topAddButton: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: "center",
  },
  topAddText: {
    color: "#0F172A",
    fontWeight: "700",
    fontSize: 13,
    marginLeft: 6,
  },
  headerTextContainer: {
    marginTop: 10,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: "#94A3B8",
    marginTop: 4,
  },
  // Card Positioning
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -50, // This pulls the card UP into the blue header
  },
  floatingCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 20,
  },
  fieldWrapper: {
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
    textTransform: "uppercase",
    marginBottom: 8,
    letterSpacing: 1,
  },
  pickerContainer: {
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  pickerStyle: {
    height: 50,
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: 50,
    fontSize: 15,
    color: "#1E293B",
  },
  primarySearchBtn: {
    backgroundColor: "#0EA5E9",
    height: 56,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#0EA5E9",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  primarySearchBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  hintContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    paddingHorizontal: 20,
  },
  hintText: {
    color: "#64748B",
    fontSize: 13,
    marginLeft: 8,
    textAlign: "center",
    lineHeight: 18,
  },
});

export default StaffDirectory;