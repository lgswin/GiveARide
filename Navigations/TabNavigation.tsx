import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';

import HomeScreen from '../Screens/HomeScreen';
import LoginScreen from '../Screens/LoginScreen';
import SignupScreen from '../Screens/SignUpScreen';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator>
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
        name="Login" 
        component={LoginScreen} 
        options={{
            tabBarIcon: ({ color }) => (
                <FontAwesome name="list" size={24} color={color} />
              )
        }}
      />
      <Tab.Screen 
        name="Signup" 
        component={SignupScreen} 
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