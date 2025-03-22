import React, { useState, useEffect } from "react";
import { View, Text, Button, TouchableOpacity, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { auth, db } from "../src/firebaseConfig";
import { doc, updateDoc, arrayUnion, getDoc,getDocs,where, deleteDoc, collection, query } from "firebase/firestore";
import globalStyles from "../styles/globalStyles";

const styles = {
  backContainer: "flex-1 bg-gray-100 p-6 mt-4",
  centeredContainer: "items-center bg-gray-100 p-6",
  title: "text-2xl font-bold text-gray-800 items-center",
  backbutton: "text-2xl font-bold text-gray-800 item-left self-start",
  detailContainer: "border border-gray-400 p-4 bg-white rounded-lg w-full max-w-md mt-10 mb-6",
  row: "flex flex-row border-b border-gray-300 py-2",
  lastrow: "flex flex-row py-2",
  label: "text-lg font-semibold text-gray-700 w-1/3",
  centerText: "text-lg font-semibold items-center justify-center",
  value: "text-lg text-gray-700 flex-1",
  requestButton: "absolute bottom-6 right-6", 
};

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
      confirmed: "pending", // Change confirmed status to "pending"
    });

    alert("기사 요청이 완료되었습니다.");
  };

  const handleConfirmDriver = async (driverNickname: string) => {
    // Fetch the driver’s email and phone number based on driverNickname
    
    // Fetch the driver information using a different method
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

    // Refresh the schedule confir
    const updatedScheduleDoc = await getDoc(scheduleRef);
    if (updatedScheduleDoc.exists()) {
      setSchedule({ id: schedule.id, ...updatedScheduleDoc.data() });
    }

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
      navigation.goBack(); // Return to the previous screen after deletion
    } catch (error) {
      console.error("스케줄 삭제 오류:", error);
      alert("스케줄을 삭제하는 중 오류가 발생했습니다.");
    }
  };

  return (
    <View className={styles.backContainer}>
      {/* Back Button with Icon */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text className={styles.backbutton}>↩</Text>
      </TouchableOpacity>
      <View className={styles.centeredContainer}>
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
          <View className={styles.row}>
            <Text className={styles.label}>상태</Text>
            <Text className={styles.value}>
              {schedule.confirmed === "pending" ? "확정 대기중" : schedule.confirmed=== "yes" ? "확정" : "미확정"}
            </Text>
          </View>
          {schedule.confirmed === "yes" && schedule.mydriver && (
          <>
            <View className={styles.row}>
              <Text className={styles.centerText}>😃 나의 기사에게 연락해서 일정을 확인하시기 바랍니다❗</Text>
            </View>
            <View className={styles.row}>
              <Text className={styles.label}>나의 기사</Text>
              <Text className={styles.value}>{schedule.mydriver}</Text>
            </View>
          </>
          )}
          {schedule.confirmed === "yes" && schedule.confirmedDriverEmail && (
            <View className={styles.row}>
              <Text className={styles.label}>기사 이메일</Text>
              <Text className={styles.value}>{schedule.confirmedDriverEmail}</Text>
            </View>
          )}
          {schedule.confirmed === "yes" && schedule.confirmedDriverPhone && (
            <View className={styles.row}>
              <Text className={styles.label}>기사 전화번호</Text>
              <Text className={styles.value}>{schedule.confirmedDriverPhone}</Text>
            </View>
          )}
          {/* Show rider list as buttons only if the schedule is pending confirmation */}
          {schedule.userEmail === auth.currentUser?.email && riderNicknames.length > 0 && schedule.confirmed === "pending" && (
            <View className={styles.row}>
              <Text className={styles.label}>기사 선택</Text>
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
        {/* Show delete button if the current user owns this schedule */}
        {schedule.userEmail === auth.currentUser?.email && (
          <TouchableOpacity onPress={handleDeleteSchedule} className="bg-red-600 px-6 py-3 rounded-lg mt-4">
            <Text className="text-white text-lg font-bold">삭제</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default MyDetailScreen;