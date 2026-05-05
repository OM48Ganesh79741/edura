import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, Dimensions, KeyboardAvoidingView, Platform, ScrollView,
  StatusBar, Animated, Pressable
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');
  const [showConfigField, setShowConfigField] = useState(false);
  const [configValue, setConfigValue] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    checkLogin();
    generateCaptcha();
    loadLocalData();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true
      })
    ]).start();
  }, []);


  const getSession = async () => {
    const sessionString = await AsyncStorage.getItem('sessionId');
    if (sessionString) {
      const sessionData = JSON.parse(sessionString);
      console.log(sessionData.id); // Output: "2025-26"
      console.log("hellooooo");
      console.warn("hello")

    }
  };

  const checkLogin = async () => {
    const token = await AsyncStorage.getItem('token');

    if (token) {
      navigation.replace('AdminPanal'); // auto redirect
    }
  };

  const loadLocalData = async () => {
    const saved = await AsyncStorage.getItem('user_config');
    if (saved) setConfigValue(saved);
  };

  const handleConfigChange = async (text) => {
    setConfigValue(text);
    await AsyncStorage.setItem('user_config', text);
  };

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
  };

  const handleLogin = async () => {
    if (!email || !password || !userCaptcha) {
      Alert.alert('Error', 'Fields cannot be empty');
      return;
    }
    if (!configValue) {
      Alert.alert("Error", "Please enter domain from 🌍 icon");
      return;
    }
    if (userCaptcha !== captcha) {
      Alert.alert('Error', 'Invalid Captcha');
      return;
    }

    try {
      const response = await axios.post(
        'http://10.0.2.2:3000/staff/adminlogin',
        { email: email.trim(), password: password.trim() },
        {
          headers: { 'Content-Type': 'application/json', 'domain': configValue },
          timeout: 8000
        }
      );

      if (response.data && response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);


        if (response.data.current_session) {
          await AsyncStorage.setItem(
            'sessionId',
            JSON.stringify(response.data.current_session)
          );
        }

        getSession();   //call session data


        // Alert box ko as a confirmation use karein taaki user 'OK' dabaye tabhi navigate ho
        Alert.alert("Success", "Login Successful", [
          {
            text: "OK",
            onPress: () => navigation.replace('AdminPanal') // 👈 Dot (.) hata diya hai
          }
        ]);
      }
    } catch (error) {
      Alert.alert('Error', error?.response?.data?.message || 'Login Failed');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], alignItems: 'center', marginBottom: 30 }}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoIcon}>🛡️</Text>
            </View>
            <Text style={styles.title}>STAFF PORTAL</Text>
            <Text style={styles.subtitle}>Secure Administration Access</Text>
          </Animated.View>

          <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <TextInput
                placeholder="admin@company.com"
                placeholderTextColor="#475569"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>PASSWORD</Text>
              <TextInput
                placeholder="••••••••"
                placeholderTextColor="#475569"
                style={styles.input}
                value={password}
                secureTextEntry
                onChangeText={setPassword}
              />
            </View>

            <Text style={styles.label}>VERIFICATION</Text>
            <View style={styles.captchaRow}>
              <TouchableOpacity onPress={generateCaptcha} style={styles.captchaBox}>
                <Text style={styles.captchaText}>{captcha}</Text>
                <Text style={styles.refreshHint}>Tap to refresh</Text>
              </TouchableOpacity>

              <TextInput
                placeholder="Code"
                placeholderTextColor="#475569"
                style={styles.inputSmall}
                value={userCaptcha}
                onChangeText={setUserCaptcha}
                autoCapitalize="characters"
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.8}>
              <Text style={styles.buttonText}>AUTHENTICATE</Text>
            </TouchableOpacity>

            {/* ✅ NAVIGATE TEXT ADDED HERE */}
            <TouchableOpacity
              onPress={() => navigation.navigate("Admin")}
              style={styles.navigateContainer}
            >
              <Text style={styles.navigateText}>
                Go to <Text style={styles.adminHighlight}>Admin Dashboard</Text>
              </Text>
            </TouchableOpacity>

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      <TouchableOpacity
        style={styles.earth}
        onPress={() => setShowConfigField(true)}
      >
        <Text style={{ fontSize: 22 }}>🌍</Text>
      </TouchableOpacity>

      {showConfigField && (
        <Pressable style={styles.overlay} onPress={() => setShowConfigField(false)}>
          <Animated.View style={styles.modal}>
            <Text style={styles.modalTitle}>Network Configuration</Text>
            <Text style={styles.modalSub}>Set the API destination domain</Text>

            <TextInput
              style={styles.modalInput}
              value={configValue}
              onChangeText={handleConfigChange}
              placeholder="e.g. 192.168.1.26:3000"
              placeholderTextColor="#475569"
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => setShowConfigField(false)}
            >
              <Text style={styles.buttonText}>UPDATE DOMAIN</Text>
            </TouchableOpacity>
          </Animated.View>
        </Pressable>
      )}
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617'
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#0F172A',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#00bcd444'
  },
  logoIcon: { fontSize: 40 },
  title: {
    fontSize: 28,
    color: 'black',
    fontWeight: '900',
    letterSpacing: 1
  },
  subtitle: {
    color: '#64748B',
    fontSize: 14,
    marginTop: 5,
    fontWeight: '500'
  },
  card: {
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1E293B',
    shadowColor: '#00bcd4',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    marginTop: 0

  },
  inputGroup: {
    marginBottom: 20
  },
  label: {
    color: '#00bcd4',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 1
  },
  input: {
    backgroundColor: '#020617',
    padding: 16,
    borderRadius: 16,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#1E293B'
  },
  inputSmall: {
    backgroundColor: '#020617',
    padding: 16,
    borderRadius: 16,
    color: '#fff',
    width: '40%',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: '#1E293B'
  },
  captchaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25
  },
  captchaBox: {
    backgroundColor: '#1E293B',
    padding: 10,
    borderRadius: 16,
    width: '55%',
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#00bcd4'
  },
  captchaText: {
    color: '#00bcd4',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 5,
    fontStyle: 'italic'
  },
  refreshHint: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 2
  },
  button: {
    backgroundColor: '#00bcd4',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#00bcd4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8
  },
  buttonText: {
    color: '#020617',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1
  },
  // ✅ STYLES FOR THE NEW NAVIGATE TEXT
  navigateContainer: {
    marginTop: 20,
    alignItems: 'center',
    padding: 10
  },
  navigateText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500'
  },
  adminHighlight: {
    color: '#00bcd4',
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
  earth: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 20,
    right: 20,
    backgroundColor: '#0F172A',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#1E293B'
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#020617f2',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modal: {
    width: '100%',
    backgroundColor: '#0F172A',
    padding: 30,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#00bcd4'
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalSub: {
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 13
  },
  modalInput: {
    backgroundColor: '#020617',
    padding: 16,
    borderRadius: 16,
    color: '#fff',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
    textAlign: 'center'
  },
  saveButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center'
  }
});