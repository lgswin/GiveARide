import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect, useRef } from "react";
import { View, Text, Button, Alert, TextInput, Platform } from "react-native";
import { auth } from "../src/firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, getFirestore, getDoc, getDocs } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import globalStyles from "../styles/globalStyles";


const HomeScreen: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [scheduleCount, setScheduleCount] = useState(0);
  const [pendingScheduleCount, setPendingScheduleCount] = useState(0);
  const [confirmedScheduleCount, setConfirmedScheduleCount] = useState(0);
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

  useEffect(() => {
    const fetchScheduleCount = async () => {
      try {
        if (!user?.uid) return;

        const dbInstance = getFirestore();
        const schedulesCollection = collection(dbInstance, "schedules");
        const snapshot = await getDocs(schedulesCollection);

        let userScheduleCount = 0;
        let pendingCount = 0;
        let confirmedCount = 0;

        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.userId === user.uid) {
            userScheduleCount++;
            if (data.confirmed === 'pending') {
              pendingCount++;
            }
            if (data.confirmed === "confirmed") {
              confirmedCount++;
            }
          }
        });

        setScheduleCount(userScheduleCount);
        setPendingScheduleCount(pendingCount);
        setConfirmedScheduleCount(confirmedCount);
      } catch (error) {
        console.error("스케줄 개수 가져오기 오류:", error);
      }
    };

    fetchScheduleCount();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("로그아웃 완료", "다시 로그인해주세요.");
    } catch (error: any) {
      console.error("로그아웃 오류:", error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      <View className={globalStyles.backContainer}>
        <View className={globalStyles.centeredContainer}>
          <Text className={globalStyles.bigTitle}>🚘 GiveARide 🚗</Text>
          <View className={globalStyles.shadowBox}>
            <Text className={globalStyles.subTitle}>
              현재 등록된 스케줄: {scheduleCount}개
            </Text>
            <Text className={globalStyles.subTitle}>
              확정 대기 중인 스케줄: {pendingScheduleCount}개
            </Text>
            <Text className={globalStyles.subTitle}>
              확정된 스케줄: {confirmedScheduleCount}개
            </Text>
          </View>
          <Button title="라이딩 요청하기" onPress={() => navigation.navigate("ScheduleScreen")} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;