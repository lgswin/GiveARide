import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { auth } from "../src/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

const styles = {
  container: "flex-1 items-center justify-center bg-gray-100",
  title: "text-3xl font-bold text-red-800 mb-6",
  authContainer: "w-full max-w-md p-5 rounded-lg mb-6 border border-20",
  authTitle: "text-xl font-bold text-center text-gray-700 mb-4",
  input: "w-full h-12 border border-gray-300 rounded-lg px-4 mb-3",
  buttonContainer: "w-full max-w-md p-5 bg-white rounded-lg shadow-md",
  userContainer: "w-full max-w-md p-5 bg-white rounded-lg shadow-md items-center",
  welcomeText: "text-2xl font-bold text-gray-800 mb-4",
};

const HomeScreen: React.FC = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
      Alert.alert("회원가입 성공!", "이메일과 비밀번호로 로그인해주세요.");
    } catch (error: any) {
      Alert.alert("회원가입 실패", error.message);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      Alert.alert("로그인 성공!", "환영합니다.");
    } catch (error: any) {
      Alert.alert("로그인 실패", error.message);
    }
  };

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
      <Text className={styles.title}>🚀GiveARide!!!!!</Text>
      {!user ? (
        <>
          <View className={styles.authContainer}>
            <Text className={styles.authTitle}>로그인</Text>
            <TextInput
              className={styles.input}
              placeholder="이메일"
              value={loginEmail}
              onChangeText={setLoginEmail}
              autoCapitalize="none"
            />
            <TextInput
              className={styles.input}
              placeholder="비밀번호"
              secureTextEntry
              value={loginPassword}
              onChangeText={setLoginPassword}
            />
            <Button title="로그인" onPress={handleLogin} />
          </View>
          
          <View className={styles.buttonContainer}>
            <Text className={styles.authTitle}>회원가입</Text>
            <TextInput
              className={styles.input}
              placeholder="이메일"
              value={signUpEmail}
              onChangeText={setSignUpEmail}
              autoCapitalize="none"
            />
            <TextInput
              className={styles.input}
              placeholder="비밀번호"
              secureTextEntry
              value={signUpPassword}
              onChangeText={setSignUpPassword}
            />
            <Button title="회원가입" onPress={handleSignUp} />
          </View>
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