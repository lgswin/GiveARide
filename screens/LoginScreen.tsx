import React, { useState } from "react";
import { View, Text, TextInput, Button, TouchableOpacity } from "react-native";
import { auth } from "../src/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

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

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setErrorMessage(""); // Clear previous error on success
    } catch (error: any) {
      let message = "로그인 실패. 다시 시도해주세요.";

      if (error.code === "auth/user-not-found") {
        message = "사용자 정보가 없습니다. 회원가입을 진행해주세요.";
      } else if (error.code === "auth/wrong-password") {
        message = "비밀번호가 올바르지 않습니다.";
      } else if (error.code === "auth/invalid-email") {
        message = "잘못된 이메일 형식입니다.";
      }

      setErrorMessage(message);
    }
  };

  return (
    <View className={styles.container}>
      <Text className={styles.title}>🚘 GiveARide 🚗</Text>
      <View className={styles.authContainer}>
        <Text className={styles.authTitle}>로그인</Text>
        <TextInput
          className={styles.input}
          placeholder="이메일"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          className={styles.input}
          placeholder="비밀번호"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button title="로그인" onPress={handleLogin} />
        
        {/* 오류 메시지 표시 */}
        {errorMessage !== "" && (
          <Text className="text-red-600 text-center mt-2">{errorMessage}</Text>
        )}

        {/* 회원가입 링크 */}
        <TouchableOpacity onPress={() => navigation.navigate("Signup")} className="mt-4">
          <Text className="text-blue-600 text-center">계정이 없으신가요? 회원가입하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;