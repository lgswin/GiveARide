import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { useIsFocused } from '@react-navigation/native';
import MyListScreen from '../screens/MyListScreen';
import MyDetailScreen from '../screens/MyDetailScreen';
import ScheduleScreen from '../screens/ScheduleScreen';

const Stack = createStackNavigator();

export default function ListScreenStackNav() {
    const isFocused = useIsFocused();
    if (!isFocused) return null; // 포커스 없으면 렌더링하지 않음

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} id={undefined}>
            <Stack.Screen name="MyListScreen" component={MyListScreen} options={{ title: 'MyList' }} />
            <Stack.Screen name="MyDetailScreen" component={MyDetailScreen} options={{ title: 'MyDetail' }} />
            <Stack.Screen name="ScheduleScreen" component={ScheduleScreen} options={{ title: 'Add a schedule' }} />
        </Stack.Navigator>
    );
}