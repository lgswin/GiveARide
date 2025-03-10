import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { auth, db } from "../src/firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
  const [nickname, setNickname] = useState(""); // Added nickname state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null); // Added profile image state
  const [errors, setErrors] = useState({
    name: "",
    nickname: "",
    phoneNumber: "",
    email: "",
    password: "",
  });

  const validateInputs = () => {
    let newErrors = { name: "", nickname: "", phoneNumber: "", email: "", password: "" };
    let isValid = true;

    if (!name) { newErrors.name = "이름을 입력해주세요."; isValid = false; }
    if (!nickname) { newErrors.nickname = "닉네임을 입력해주세요."; isValid = false; }
    if (!phoneNumber) { 
      newErrors.phoneNumber = "전화번호를 입력해주세요."; 
      isValid = false; 
    } else {
      const phoneRegex = /^(\d{3}-\d{3}-\d{4}|\d{10})$/;
      if (!phoneRegex.test(phoneNumber)) {
        newErrors.phoneNumber = "올바른 전화번호 형식을 입력해주세요. (예: 123-456-7890 또는 1234567890)";
        isValid = false;
      }
    }
    if (!email) { newErrors.email = "이메일을 입력해주세요."; isValid = false; }
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) { newErrors.email = "올바른 이메일 형식을 입력해주세요."; isValid = false; }
    }
    if (!password) { newErrors.password = "비밀번호를 입력해주세요."; isValid = false; }

    setErrors(newErrors);
    return isValid;
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSignup = async () => {
    if (!validateInputs()) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      let imageUrl = "";

      // Upload profile image if selected
      if (profileImage) {
        const storage = getStorage();
        const imageRef = ref(storage, `profileImages/${user.uid}.jpg`);
        const response = await fetch(profileImage);
        const blob = await response.blob();
        await uploadBytes(imageRef, blob);
        imageUrl = await getDownloadURL(imageRef);
      }

      // Update user profile with displayName and photoURL
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: imageUrl || null,
      });

      await user.reload();

      // Store additional user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        nickname: nickname,
        phoneNumber: phoneNumber,
        email: email,
        profileImage: imageUrl,
      });

      Alert.alert("회원가입 성공!", "이메일과 비밀번호로 로그인해주세요.");
      navigation.navigate("Login");
    } catch (error: any) {
      console.error("Firebase Signup Error:", error.code, error.message);
      let newErrors = { ...errors };
      if (error.code === "auth/email-already-in-use") {
        newErrors.email = "이미 사용 중인 이메일입니다. 다른 이메일을 입력해주세요.";
      } else {
        Alert.alert("회원가입 실패", `오류 코드: ${error.code}\n메시지: ${error.message}`);
      }
      setErrors(newErrors);
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
        {errors.name ? <Text className="text-red-500 text-sm">{errors.name}</Text> : null}
        <TextInput
          className={styles.input}
          placeholder="닉네임" // Added nickname input
          value={nickname}
          onChangeText={setNickname}
        />
        {errors.nickname ? <Text className="text-red-500 text-sm">{errors.nickname}</Text> : null}
        <TextInput
          className={styles.input}
          placeholder="전화번호"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
        {errors.phoneNumber ? <Text className="text-red-500 text-sm">{errors.phoneNumber}</Text> : null}
        <TextInput
          className={styles.input}
          placeholder="이메일"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        {errors.email ? <Text className="text-red-500 text-sm">{errors.email}</Text> : null}
        <TextInput
          className={styles.input}
          placeholder="비밀번호"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {errors.password ? <Text className="text-red-500 text-sm">{errors.password}</Text> : null}
        <Button title="프로필 이미지 선택" onPress={pickImage} />
        {profileImage && <Image source={{ uri: profileImage }} style={{ width: 100, height: 100, borderRadius: 50, marginTop: 10 }} />}
        <Button title="회원가입" onPress={handleSignup} />
      </View>
    </View>
  );
};

export default SignupScreen;