import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { useIsFocused } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import ScheduleScreen from '../screens/ScheduleScreen';

const Stack = createStackNavigator();

export default function HomeScreenStackNav() {
    const isFocused = useIsFocused();
    if (!isFocused) return null; // 포커스 없으면 렌더링하지 않음

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} id={undefined}>
            <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Home' }} />
            <Stack.Screen name="ScheduleScreen" component={ScheduleScreen} options={{ title: 'Schedule' }} />
        </Stack.Navigator>
    );
}