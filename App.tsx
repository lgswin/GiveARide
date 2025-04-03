import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./src/firebaseConfig";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignUpScreen";
import TabNavigation from "./Navigations/TabNavigation";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import './global.css'; // !!!! 이거 없으면 nativewind가 적용이 안됨~ !!!!

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-lg font-bold">로딩 중...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView className="flex-1 items-center bg-white px-4">
      <View className="w-full max-w-screen-md flex-1">
        <NavigationContainer>
          <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
            {!user ? (
              <>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Signup" component={SignupScreen} />
              </>
            ) : (
              <Stack.Screen name="Main" component={TabNavigation} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </GestureHandlerRootView>
  );
};

export default App;