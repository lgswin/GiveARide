import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import ListScreen from '../Screens/ListScreen';
import DetailScreen from '../Screens/DetailScreen';

const Stack = createStackNavigator();

export default function ListScreenStackNav() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ListScreen" component={ListScreen} options={{ title: 'List' }} />
            <Stack.Screen name="DetailScreen" component={DetailScreen} options={{ title: 'Detail' }} />
        </Stack.Navigator>
    );
}