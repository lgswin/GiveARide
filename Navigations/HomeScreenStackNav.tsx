import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import ListScreen from '../Screens/ListScreen';
import DetailScreen from '../Screens/DetailScreen';
import HomeScreen from '../Screens/HomeScreen';
import ScheduleScreen from '../Screens/ScheduleScreen';

const Stack = createStackNavigator();

export default function HomeScreenStackNav() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Home' }} />
            <Stack.Screen name="ScheduleScreen" component={ScheduleScreen} options={{ title: 'Schedule' }} />
        </Stack.Navigator>
    );
}