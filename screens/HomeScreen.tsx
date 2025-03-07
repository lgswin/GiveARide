import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert } from "react-native";
import { auth } from "../src/firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";

const styles = {
  container: "flex-1 items-center justify-start bg-gray-100 pt-20",
  title: "text-3xl font-bold text-red-800 mb-6",
  authContainer: "w-full max-w-md p-5 rounded-lg mb-6 border border-20",
  authTitle: "text-xl font-bold text-center text-gray-700 mb-4",
  input: "w-full h-12 border border-gray-300 rounded-lg px-4 mb-3",
  buttonContainer: "w-full max-w-md p-5 bg-white rounded-lg shadow-md",
  userContainer: "w-full max-w-md p-5 bg-white rounded-lg shadow-md items-center",
  welcomeText: "text-2xl font-bold text-gray-800 mb-4",
};

const HomeScreen: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("로그아웃 완료", "다시 로그인해주세요.");
    } catch (error: any) {
      console.error("로그아웃 오류:", error.message);
    }
  };

  return (
    <View className={styles.container}>
      <Text className={styles.title}>🚘 GiveARide 🚗</Text>
      {!user ? (
          <>
          </>
      ) : (
        <View className={styles.userContainer}>
          <Text className={styles.welcomeText}>환영합니다, {user.email}! 🎉</Text>
          <Button title="로그아웃" onPress={handleLogout} />
        </View>
      )}
    </View>
  );
};

export default HomeScreen;