import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { auth } from "../src/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

const HomeScreen = () => {
  // 로그인용 상태 변수
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // 회원가입용 상태 변수
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 확인

  // 회원가입 핸들러
  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
      Alert.alert("회원가입 성공!", "이메일과 비밀번호로 로그인해주세요.");
    } catch (error: any) {
      Alert.alert("회원가입 실패", error.message);
    }
  };

  // 로그인 핸들러
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      setIsLoggedIn(true); // 로그인 성공 시 상태 변경
      Alert.alert("로그인 성공!", "환영합니다.");
    } catch (error: any) {
      Alert.alert("로그인 실패", error.message);
    }
  };

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false); // 로그인 상태 변경
      Alert.alert("로그아웃 완료", "다시 로그인해주세요.");
    } catch (error: any) {
      console.error("로그아웃 오류:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚀 GiveARide</Text>

      {!isLoggedIn ? (
        <>
          {/* 로그인 UI */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>로그인</Text>
            <TextInput
              style={styles.input}
              placeholder="이메일"
              value={loginEmail}
              onChangeText={setLoginEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="비밀번호"
              value={loginPassword}
              onChangeText={setLoginPassword}
              secureTextEntry
            />
            <Button title="로그인" onPress={handleLogin} />
          </View>

          {/* 회원가입 UI */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>회원가입</Text>
            <TextInput
              style={styles.input}
              placeholder="이메일"
              value={signUpEmail}
              onChangeText={setSignUpEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="비밀번호"
              value={signUpPassword}
              onChangeText={setSignUpPassword}
              secureTextEntry
            />
            <Button title="회원가입" onPress={handleSignUp} />
          </View>
        </>
      ) : (
        <View style={styles.loggedInContainer}>
          <Text style={styles.welcomeText}>환영합니다! 🎉</Text>
          <Button title="로그아웃" onPress={handleLogout} />
        </View>
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: {
    width: "100%",
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  loggedInContainer: {
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});