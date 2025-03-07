import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { auth } from "../src/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("로그인 성공!", "환영합니다.");
      navigation.navigate("Home");
    } catch (error: any) {
      Alert.alert("로그인 실패", error.message);
    }
  };

  return (
    <View>
      <Text>로그인</Text>
      <TextInput placeholder="이메일" value={email} onChangeText={setEmail} />
      <TextInput placeholder="비밀번호" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="로그인" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;