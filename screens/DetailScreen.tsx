import React, { useState, useEffect } from "react";
import { View, Text, Button, TouchableOpacity, SafeAreaView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { auth, db } from "../src/firebaseConfig";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons"; // Ensure you have `expo/vector-icons` installed
import globalStyles from "../styles/globalStyles";

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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      <View className={globalStyles.backContainer}>
        {/* Back Button with Icon */}
        <TouchableOpacity onPress={() => navigation.goBack()}> 
            <Text className={globalStyles.backbutton}>↩</Text>
        </TouchableOpacity>

        <View className={globalStyles.centeredContainer}>
        <Text className={globalStyles.title}>📌 스케줄 상세 정보</Text>
        <View className={globalStyles.detailContainer}>
          <View className={globalStyles.row}>
            <Text className={globalStyles.label}>출발지</Text>
            <Text className={globalStyles.value}>{schedule.departure}</Text>
          </View>
          <View className={globalStyles.row}>
            <Text className={globalStyles.label}>도착지</Text>
            <Text className={globalStyles.value}>{schedule.destination}</Text>
          </View>
          <View className={globalStyles.row}>
            <Text className={globalStyles.label}>날짜</Text>
            <Text className={globalStyles.value}>{schedule.date}</Text>
          </View>
          <View className={globalStyles.row}>
            <Text className={globalStyles.label}>탑승 인원</Text>
            <Text className={globalStyles.value}>{schedule.passengerCount || "정보 없음"}</Text>
          </View>
          <View className={globalStyles.row}>
            <Text className={globalStyles.label}>상세 내용</Text>
            <Text className={globalStyles.value}>{schedule.details || "정보 없음"}</Text>
          </View>
          <View className={globalStyles.row}>
            <Text className={globalStyles.label}>등록자</Text>
            <Text className={globalStyles.value}>{schedule.nickname}</Text>
          </View>
          <View className={globalStyles.lastrow}>
            <Text className={globalStyles.label}>상태</Text>
            <Text className={globalStyles.value}>
              {schedule.confirmed === "pending" ? "확정 대기중" : schedule.confirmed==="yes" ? "확정" : "미확정"}
            </Text>
          </View>
          {/* Show rider nicknames */}
          {riderNicknames.length > 0 && (
            <View className={globalStyles.row}>
              <Text className={globalStyles.label}>기사 목록</Text>
              <Text className={globalStyles.value}>{riderNicknames.join(", ")}</Text>
            </View>
          )}
        </View>
        </View>

        {/* Request Ride Button in Bottom-Right */}
        {isDriver && (
          <TouchableOpacity onPress={handleRequestRide} className={globalStyles.requestButton}>
            <View className="bg-blue-600 p-4 rounded-full shadow-lg">
              <Text className="text-white text-lg font-bold">기사 요청</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default DetailScreen;