import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { useIsFocused } from '@react-navigation/native';
import ListScreen from '../screens/ListScreen';
import DetailScreen from '../screens/DetailScreen';

const Stack = createStackNavigator();
export default function ListScreenStackNav() {
    const isFocused = useIsFocused();
    if (!isFocused) return null; // 포커스 없으면 렌더링하지 않음
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} id={undefined}>
            <Stack.Screen name="ListScreen" component={ListScreen} options={{ title: 'List' }} />
            <Stack.Screen name="DetailScreen" component={DetailScreen} options={{ title: 'Detail' }} />
        </Stack.Navigator>
    );
}