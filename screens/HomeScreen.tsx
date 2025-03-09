import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert, TextInput } from "react-native";
import DatePicker from "react-native-ui-datepicker";
import { auth } from "../src/firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { db } from "../src/firebaseConfig";
import { collection, addDoc, getFirestore } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { parse, format, isValid } from "date-fns";

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
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [dateError, setDateError] = useState("");
  const [scheduleUpdated, setScheduleUpdated] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          ...currentUser,
          displayName: currentUser.displayName || "사용자",
        });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const validateDateFormat = (dateString: string): boolean => {
    const parsedDate = parse(dateString, "yyyy-M-d H:mm", new Date());
    return isValid(parsedDate) && format(parsedDate, "yyyy-MM-dd HH:mm") === format(parsedDate, "yyyy-MM-dd HH:mm");
  };

  const handleScheduleSubmit = async () => {
    if (!departure || !destination || !date) {
      Alert.alert("입력 오류", "모든 필드를 입력해주세요.");
      return;
    }

    const parsedDate = parse(date, "yyyy-M-d H:mm", new Date());
    if (!isValid(parsedDate)) {
      setDateError("날짜 형식이 올바르지 않습니다. (YYYY-MM-DD 00:00)");
      return;
    } else {
      setDateError("");
    }

    const formattedDate = format(parsedDate, "yyyy-MM-dd HH:mm");

    try {
      const dbInstance = getFirestore();
      const schedulesCollection = collection(dbInstance, "schedules");

      await addDoc(schedulesCollection, {
        departure,
        destination,
        date: formattedDate,
        userEmail: user?.email || "Unknown",
        createdAt: new Date(),
      });

      Alert.alert("등록 완료", "스케줄이 성공적으로 등록되었습니다.");
      setDeparture("");
      setDestination("");
      setDate("");
      setScheduleUpdated(true);
    } catch (error: any) {
      console.error("스케줄 등록 오류:", error.message);
      Alert.alert("등록 실패", "스케줄을 저장하는 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setScheduleUpdated(false);
    });

    return unsubscribe;
  }, [navigation]);

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
          <Text className={styles.welcomeText}>환영합니다, {user.displayName}! 🎉</Text>
          
          <View className="w-full max-w-md p-5 bg-white rounded-lg shadow-md mt-6">
            <Text className="text-xl text-center font-bold text-gray-700 mb-4">스케줄을 등록해주세요</Text>
            <TextInput
              className={styles.input}
              placeholder="출발지"
              value={departure}
              onChangeText={setDeparture}
            />
            <TextInput
              className={styles.input}
              placeholder="도착지"
              value={destination}
              onChangeText={setDestination}
            />
            <TextInput
              className={styles.input}
              placeholder="날짜 (YYYY-MM-DD 00:00)"
              value={date}
              onChangeText={setDate}
            />
            {dateError ? <Text className="text-red-500">{dateError}</Text> : null}
            <Button title="등록하기" onPress={handleScheduleSubmit} />
          </View>
        </View>
      )}
    </View>
  );
};

export default HomeScreen;