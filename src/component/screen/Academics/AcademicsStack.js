import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ClassTimetable from './ClassTimetable';
import SectionManager from './SectionManager';

const Stack = createNativeStackNavigator();
const AcademicsStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#0f172a' },
                headerTintColor: '#fff'
            }}>



            <Stack.Screen
                name="ClassTimetable"
                component={ClassTimetable}
                options={{ headerShown: false }}
            />


            <Stack.Screen
                name="Section"
                component={SectionManager}
                options={{ headerShown: false }}
            />


        </Stack.Navigator>
    )
}

export default AcademicsStack

const styles = StyleSheet.create({})