import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExamType from './ExamType';

const Stack = createNativeStackNavigator();
const ExamStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#0f172a' },
                headerTintColor: '#fff'
            }}>



            <Stack.Screen
                name="Exam Type"
                component={ExamType}
                options={{ title: "Exam Type" }}
            />


        </Stack.Navigator>
    )
}

export default ExamStack

const styles = StyleSheet.create({})