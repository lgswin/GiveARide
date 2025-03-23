import React, { useState, useEffect } from "react";
import { View, Text, Button, TouchableOpacity, Alert, SafeAreaView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { auth, db } from "../src/firebaseConfig";
import { doc, updateDoc, arrayUnion, getDoc,getDocs,where, deleteDoc, collection, query } from "firebase/firestore";
import globalStyles from "../styles/globalStyles";

const MyDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { schedule } = route.params as { schedule: any };
  const [isDriver, setIsDriver] = useState(false);
  const [riderNicknames, setRiderNicknames] = useState<string[]>([]);
  const [driverContactInfo, setDriverContactInfo] = useState<{ email: string; phone: string } | null>(null);

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
      confirmed: "pending",
    });

    alert("기사 요청이 완료되었습니다.");
  };

  const handleConfirmDriver = async (driverNickname: string) => {
    const driverQuerySnapshot = await getDocs(query(collection(db, "users"), where("nickname", "==", driverNickname)));
    const driverDoc = driverQuerySnapshot.docs[0];
    console.log(driverNickname, driverDoc.data().email, driverDoc.data().phoneNumber);
    const driverContactInfo = driverDoc.exists() ? {
      email: driverDoc.data().email || "알 수 없음",
      phone: driverDoc.data().phoneNumber || "알 수 없음"
    } : { email: "알 수 없음", phone: "알 수 없음" };

    if (!schedule.id) return;

    const scheduleRef = doc(db, "schedules", schedule.id);
    console.log("update schedule", driverContactInfo);
    await updateDoc(scheduleRef, {
      mydriver: driverNickname,
      confirmedDriverEmail: driverContactInfo.email,
      confirmedDriverPhone: driverContactInfo.phone,
      confirmed: "yes",
    });

    alert(`${driverNickname}님이 기사로 확정되었습니다.`);

    // Show driver details pop-up
    Alert.alert(
      "기사 확정 완료",
      `${driverNickname} 님이 기사로 확정되었습니다.\n안전한 이용을 위해 연락처 및 차량 정보를 확인하세요.`,
      [{ text: "확인", onPress: () => console.log("Driver confirmed") }]
    );
  };

  const handleDeleteSchedule = async () => {
    if (!schedule.id) return;

    try {
      const scheduleRef = doc(db, "schedules", schedule.id);
      await deleteDoc(scheduleRef);
      alert("스케줄이 삭제되었습니다.");
      navigation.goBack();
    } catch (error) {
      console.error("스케줄 삭제 오류:", error);
      alert("스케줄을 삭제하는 중 오류가 발생했습니다.");
    }
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
              <View className={globalStyles.col1}>
                <Text className={globalStyles.label}>출발지</Text>
              </View>
              <View className={globalStyles.col2}>
                <Text className={globalStyles.value}>{schedule.departure}</Text>
              </View>
            </View>
            <View className={globalStyles.row}>
              <View className={globalStyles.col1}>
                <Text className={globalStyles.label}>도착지</Text>
              </View>
              <View className={globalStyles.col2}>
                <Text className={globalStyles.value}>{schedule.destination}</Text>
              </View>
            </View>
            <View className={globalStyles.row}>
              <View className={globalStyles.col1}>
                <Text className={globalStyles.label}>날짜</Text>
              </View>
              <View className={globalStyles.col2}>
                <Text className={globalStyles.value}>{schedule.date}</Text>
              </View>
            </View>
            <View className={globalStyles.row}>
              <View className={globalStyles.col1}>
                <Text className={globalStyles.label}>탑승 인원</Text>
              </View>
              <View className={globalStyles.col2}>
                <Text className={globalStyles.value}>{schedule.passengerCount || "정보 없음"}</Text>
              </View>
            </View>
            <View className={globalStyles.row}>
              <View className={globalStyles.col1}>
                <Text className={globalStyles.label}>상세 내용</Text>
              </View>
              <View className={globalStyles.col2}>
                <Text className={globalStyles.value}>{schedule.details || "정보 없음"}</Text>
              </View>
            </View>
            <View className={globalStyles.row}>
              <View className={globalStyles.col1}>
                <Text className={globalStyles.label}>등록자</Text>
              </View>
              <View className={globalStyles.col2}>
                <Text className={globalStyles.value}>{schedule.nickname}</Text>
              </View>
            </View>
            <View className={globalStyles.row}>
              <View className={globalStyles.col1}>
                <Text className={globalStyles.label}>상태</Text>
              </View>
              <View className={globalStyles.col2}>
                <Text className={globalStyles.value}>
                  {schedule.confirmed === "pending" ? "확정 대기중" : schedule.confirmed=== "yes" ? "확정" : "미확정"}
                </Text>
              </View>
            </View>
            {schedule.confirmed === "yes" && schedule.mydriver && (
              <>
                <View className={globalStyles.row}>
                  <View className={globalStyles.col1}>
                    <Text className={globalStyles.label}>나의 기사</Text>
                  </View>
                  <View className={globalStyles.col2}>
                    <Text className={globalStyles.value}>{schedule.mydriver}</Text>
                  </View>
                </View>
              </>
            )}
            {schedule.confirmed === "yes" && schedule.confirmedDriverEmail && (
              <View className={globalStyles.row}>
                <View className={globalStyles.col1}>
                  <Text className={globalStyles.label}>기사 이메일</Text>
                </View>
                <View className={globalStyles.col2}>
                  <Text className={globalStyles.value}>{schedule.confirmedDriverEmail}</Text>
                </View>
              </View>
            )}
            {schedule.confirmed === "yes" && schedule.confirmedDriverPhone && (
              <View className={globalStyles.row}>
                <View className={globalStyles.col1}>
                  <Text className={globalStyles.label}>기사 전화번호</Text>
                </View>
                <View className={globalStyles.col2}>
                  <Text className={globalStyles.value}>{schedule.confirmedDriverPhone}</Text>
                </View>
              </View>
            )}
            {schedule.userEmail === auth.currentUser?.email && riderNicknames.length > 0 && schedule.confirmed === "pending" && (
              <View className={globalStyles.row}>
                <Text className={globalStyles.label}>기사 선택</Text>
                <View className="flex flex-row flex-wrap">
                  {riderNicknames.map((rider, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleConfirmDriver(rider)}
                      className="bg-blue-600 px-4 py-2 m-1 rounded-lg"
                    >
                      <Text className="text-white">{rider}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
          {schedule.userEmail === auth.currentUser?.email && (
            <TouchableOpacity onPress={handleDeleteSchedule} className="bg-red-600 px-6 py-3 rounded-lg mt-4">
              <Text className="text-white text-lg font-bold">삭제</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MyDetailScreen;