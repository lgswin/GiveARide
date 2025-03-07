import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigation from './Navigations/TabNavigation';
import './global.css'; // !!!! 이거 없으면 nativewind가 적용이 안됨~ !!!!

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
        <TabNavigation />
    </NavigationContainer>
  );
}