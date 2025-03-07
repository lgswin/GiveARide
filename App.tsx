import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigation from './Navigations/TabNavigation';
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import HomeScreen from "./screens/HomeScreen"; // 홈 화면 추가

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
        <TabNavigation />
    </NavigationContainer>
  );
}