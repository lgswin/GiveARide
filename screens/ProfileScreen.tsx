import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert } from "react-native";
import { auth, db } from "../src/firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

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

const ProfileScreen = ({ navigation }: any) => {
  const [user, setUser] = useState<any>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Fetch phone number from Firestore
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setPhoneNumber(userDoc.data().phoneNumber || "전화번호 없음");
        }
      } else {
        setUser(null);
        setPhoneNumber("");
      }
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
          <Text className="text-lg text-red-500">로그인이 필요합니다.</Text>
        </>
      ) : (
        <View className={styles.userContainer}>
          <Text className={styles.welcomeText}>{user.displayName || "사용자"}! 🎉</Text>
          <Text className="text-lg">{user.email}</Text>
          <Text className="text-lg pb-10">{phoneNumber}</Text>
          <Button title="로그아웃" onPress={handleLogout} />
        </View>
      )}
    </View>
  );
};

export default ProfileScreen;