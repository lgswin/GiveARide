import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';

import HomeScreen from '../Screens/HomeScreen';
import ListScreen from '../Screens/ListScreen';
import ProfileScreen from '../Screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home" 
        component={HomeScreen} 
        options={{
            tabBarIcon: ({ color }) => (
                <AntDesign name="home" size={24} color={color} />
              )
        }}
      />
      <Tab.Screen 
        name="List" 
        component={ListScreen} 
        options={{
            tabBarIcon: ({ color }) => (
                <FontAwesome name="list" size={24} color={color} />
              )
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
            tabBarIcon: ({ color }) => (
                <AntDesign name="profile" size={24} color={color} />
              )
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;