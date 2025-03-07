import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { auth } from "../src/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

const SignUpScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("회원가입 성공!", "이메일과 비밀번호로 로그인해주세요.");
      navigation.navigate("Login");
    } catch (error: any) {
      Alert.alert("회원가입 실패", error.message);
    }
  };

  return (
    <View>
      <Text>회원가입</Text>
      <TextInput placeholder="이메일" value={email} onChangeText={setEmail} />
      <TextInput placeholder="비밀번호" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="회원가입" onPress={handleSignUp} />
    </View>
  );
};

export default SignUpScreen;