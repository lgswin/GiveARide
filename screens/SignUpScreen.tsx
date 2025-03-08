import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { auth, db } from "../src/firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

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

const SignupScreen = ({ navigation }: any) => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile with displayName
      await updateProfile(auth.currentUser, {
        displayName: name,
      });
      
      // Reload user to ensure updated profile data is reflected
      await user.reload();

      // Store additional user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        phoneNumber: phoneNumber,
        email: email,
      });

      Alert.alert("회원가입 성공!", "이메일과 비밀번호로 로그인해주세요.");
      navigation.navigate("Login");
    } catch (error: any) {
      Alert.alert("회원가입 실패", error.message);
    }
  };

  return (
    <View className={styles.container}>
      <View className={styles.buttonContainer}>
        <Text className={styles.authTitle}>회원가입</Text>
        <TextInput
          className={styles.input}
          placeholder="이름"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          className={styles.input}
          placeholder="전화번호"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
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
        <Button title="회원가입" onPress={handleSignup} />
      </View>
    </View>
  );
};

export default SignupScreen;