import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getFirestore, collection, addDoc, doc, getDoc } from "firebase/firestore";
import { parse, format, isValid } from "date-fns";
import { auth } from "../src/firebaseConfig";
import { Ionicons } from "@expo/vector-icons"; // Ensure you have `expo/vector-icons` installed

const styles = {
    container: "flex-1 items-center justify-start bg-gray-100 pt-20",
    title: "text-3xl font-bold text-red-800 mb-6",
    authContainer: "w-full max-w-md p-5 rounded-lg mb-6 border border-20",
    authTitle: "text-xl font-bold text-center text-gray-700 mb-4",
    subTitle: "text-xl font-bold text-center text-gray-700",
    input: "w-full h-12 border border-gray-300 rounded-lg px-4 mb-3",
    buttonContainer: "w-full max-w-md p-5 bg-white rounded-lg shadow-md",
    shodowBox: "w-full max-w-md p-5 bg-white rounded-lg shadow-md items-center",
    welcomeText: "text-2xl font-bold text-gray-800 mb-4",
    backButton: "absolute top-12 left-4 p-2", // Increased top spacing to avoid status bar overlap
  };

const ScheduleScreen = () => {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [passengerCount, setPassengerCount] = useState("");
  const [details, setDetails] = useState("");
  const [dateError, setDateError] = useState("");
  const navigation = useNavigation();
  const user = auth.currentUser;

  const handleScheduleSubmit = async () => {
    if (!departure || !destination || !date || !passengerCount || !details) {
      Alert.alert("입력 오류", "모든 필드를 입력해주세요.");
      return;
    }

    const parsedDate = parse(date, "yyyy-M-d H:mm", new Date());
    if (!isValid(parsedDate)) {
      setDateError("날짜 형식이 올바르지 않습니다. (예: 2025-03-20 15:00)");
      return;
    } else {
      setDateError("");
    }

    const formattedDate = format(parsedDate, "yyyy-MM-dd HH:mm");

    try {
      const dbInstance = getFirestore();
      const schedulesCollection = collection(dbInstance, "schedules");

      let nickname = "알 수 없음";
      let phoneNumber = "정보 없음";
      let profileImage = null;
      let mydriver = "";

      if (user?.uid) {
        const userDoc = await getDoc(doc(dbInstance, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          nickname = userData.nickname || nickname;
          phoneNumber = userData.phoneNumber || phoneNumber;
          profileImage = userData.profileImage || profileImage;
          if (userData.driver && userData.nickname) {
            mydriver = userData.nickname;
          }
        }
      }

      await addDoc(schedulesCollection, {
        departure,
        destination,
        date: formattedDate,
        passengerCount,
        details,
        confirmedDriverEmail: "",
        confirmedDriverPhone: "",
        userEmail: user?.email || "Unknown",
        userId: user?.uid || "Unknown",
        nickname,
        phoneNumber,
        profileImage,
        mydriver,
        createdAt: new Date(),
        confirmed: "no",
        riders: [],
      });

      Alert.alert("등록 완료", "스케줄이 성공적으로 등록되었습니다.");
      navigation.goBack();
    } catch (error: any) {
      console.error("스케줄 등록 오류:", error.message);
      Alert.alert("등록 실패", "스케줄을 저장하는 중 오류가 발생했습니다.");
    }
  };

  return (
    <View className={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} className={styles.backButton}>
        <Ionicons name="chevron-back" size={28} color="black" />
      </TouchableOpacity>

      <Text className={styles.title}>스케줄 등록</Text>
      <View className={styles.shodowBox}>
        <TextInput className={styles.input} placeholder="출발지" value={departure} onChangeText={setDeparture} />
        <TextInput className={styles.input} placeholder="도착지" value={destination} onChangeText={setDestination} />
        <TextInput className={styles.input} placeholder="날짜 (YYYY-MM-DD HH:mm)" value={date} onChangeText={setDate} />
        <TextInput className={styles.input} placeholder="탑승 인원" value={passengerCount} onChangeText={setPassengerCount} keyboardType="numeric" />
        <TextInput className={styles.input} placeholder="상세 내용" value={details} onChangeText={setDetails} multiline />
        {dateError ? <Text className="text-red-500">{dateError}</Text> : null}
      </View>
      <Button title="등록하기" onPress={handleScheduleSubmit} />
    </View>
  );
};

export default ScheduleScreen;