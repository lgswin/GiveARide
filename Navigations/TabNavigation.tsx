import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from "react-native";

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ListScreenStackNav from './ListScreenStackNav';
import MyListScreenStackNav from './MyListScreenStackNav';
import HomeScreenStackNav from './HomeScreenStackNav';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} id={undefined}>
      <Tab.Screen
        name="Home" 
        component={HomeScreenStackNav} 
        options={{
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🏠</Text>,
        }}
        
      />
      <Tab.Screen 
        name="MyList" 
        component={MyListScreenStackNav} 
        
        options={{
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📋</Text>,
        }}
      />
      <Tab.Screen 
        name="List" 
        component={ListScreenStackNav} 
        options={{
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📋</Text>,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;