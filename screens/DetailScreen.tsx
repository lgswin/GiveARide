import React, { useState, useEffect } from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { auth, db } from "../src/firebaseConfig";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons"; // Ensure you have `expo/vector-icons` installed

const styles = {
  container: "flex-1 items-center justify-center bg-gray-100 p-6",
  title: "text-2xl font-bold text-gray-800 mb-6",
  detailContainer: "border border-gray-400 p-4 bg-white rounded-lg w-full max-w-md mb-6",
  row: "flex flex-row border-b border-gray-300 py-2",
  lastrow: "flex flex-row py-2",
  label: "text-lg font-semibold text-gray-700 w-1/3",
  value: "text-lg text-gray-700 flex-1",
  backButton: "absolute top-12 left-4 p-2", // Increased top spacing to avoid status bar overlap
  requestButton: "absolute bottom-6 right-6", // Move request button to bottom-right
};

const DetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { schedule } = route.params as { schedule: any };
  const [isDriver, setIsDriver] = useState(false);
  const [riderNicknames, setRiderNicknames] = useState<string[]>([]);

  useEffect(() => {
    const checkDriverStatus = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().driver) {
          setIsDriver(true);
        }
      }
    };
    checkDriverStatus();
  }, []);

  useEffect(() => {
    const fetchRiderNicknames = async () => {
      if (!schedule.riders || schedule.riders.length === 0) return;
      const nicknames: string[] = [];
      for (const riderId of schedule.riders) {
        const riderDoc = await getDoc(doc(db, "users", riderId));
        if (riderDoc.exists()) {
          nicknames.push(riderDoc.data().nickname || "알 수 없음");
        }
      }
      setRiderNicknames(nicknames);
    };
    fetchRiderNicknames();
  }, [schedule.riders]);

  const handleRequestRide = async () => {
    if (!auth.currentUser) return;

    const scheduleRef = doc(db, "schedules", schedule.id);
    await updateDoc(scheduleRef, {
      riders: arrayUnion(auth.currentUser.uid),
      confirmed: "pending", // Change confirmed status to "pending"
    });

    alert("기사 요청이 완료되었습니다.");
  };

  return (
    <View className={styles.container}>
      {/* Back Button with Icon */}
      <TouchableOpacity onPress={() => navigation.goBack()} className={styles.backButton}>
        <Ionicons name="chevron-back" size={28} color="black" />
      </TouchableOpacity>

      <Text className={styles.title}>📌 스케줄 상세 정보</Text>
      <View className={styles.detailContainer}>
        <View className={styles.row}>
          <Text className={styles.label}>출발지</Text>
          <Text className={styles.value}>{schedule.departure}</Text>
        </View>
        <View className={styles.row}>
          <Text className={styles.label}>도착지</Text>
          <Text className={styles.value}>{schedule.destination}</Text>
        </View>
        <View className={styles.row}>
          <Text className={styles.label}>날짜</Text>
          <Text className={styles.value}>{schedule.date}</Text>
        </View>
        <View className={styles.row}>
          <Text className={styles.label}>탑승 인원</Text>
          <Text className={styles.value}>{schedule.passengerCount || "정보 없음"}</Text>
        </View>
        <View className={styles.row}>
          <Text className={styles.label}>상세 내용</Text>
          <Text className={styles.value}>{schedule.details || "정보 없음"}</Text>
        </View>
        <View className={styles.row}>
          <Text className={styles.label}>등록자</Text>
          <Text className={styles.value}>{schedule.nickname}</Text>
        </View>
        <View className={styles.lastrow}>
          <Text className={styles.label}>상태</Text>
          <Text className={styles.value}>
            {schedule.confirmed === "pending" ? "확정 대기중" : schedule.confirmed ? "확정" : "미확정"}
          </Text>
        </View>
        {/* Show rider nicknames */}
        {riderNicknames.length > 0 && (
          <View className={styles.row}>
            <Text className={styles.label}>기사 목록</Text>
            <Text className={styles.value}>{riderNicknames.join(", ")}</Text>
          </View>
        )}
      </View>

      {/* Request Ride Button in Bottom-Right */}
      {isDriver && (
        <TouchableOpacity onPress={handleRequestRide} className={styles.requestButton}>
          <View className="bg-blue-600 p-4 rounded-full shadow-lg">
            <Text className="text-white text-lg font-bold">기사 요청</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default DetailScreen;