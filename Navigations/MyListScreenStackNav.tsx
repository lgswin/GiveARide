import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import MyListScreen from '../screens/MyListScreen';
import MyDetailScreen from '../screens/MyDetailScreen';

const Stack = createStackNavigator();

export default function ListScreenStackNav() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} id={undefined}>
            <Stack.Screen name="MyListScreen" component={MyListScreen} options={{ title: 'MyList' }} />
            <Stack.Screen name="MyDetailScreen" component={MyDetailScreen} options={{ title: 'MyDetail' }} />
        </Stack.Navigator>
    );
}