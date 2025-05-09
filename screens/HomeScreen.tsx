import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect, } from "react";
import { View, Text, Button, Alert, TouchableOpacity } from "react-native";
import { auth } from "../src/firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { collection, getFirestore,  getDocs } from "firebase/firestore";
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
    <SafeAreaView className="flex-1 items-center bg-gray-100 px-4">
      <View className={`${globalStyles.backContainer} w-full max-w-screen-md`}>
        <View className={globalStyles.centeredContainer}>
          
          <Text className={globalStyles.bigTitle}>🚘 GiveARide 🚗</Text>

          <View className={globalStyles.rowContainer}>
            <View className={globalStyles.shadowBox1_3}>
              <Text className={globalStyles.subTitle}>
                현재
              </Text>
              <Text className={globalStyles.subTitle}>
                {scheduleCount}개
              </Text>
            </View>

            <View className={globalStyles.shadowBox1_3}>
              <Text className={globalStyles.subTitle}>
                대기
              </Text>
              <Text className={globalStyles.subTitle}>
                {pendingScheduleCount}개
              </Text>
            </View>

            <View className={globalStyles.shadowBox1_3}>
              <Text className={globalStyles.subTitle}>
                확정
              </Text>
              <Text className={globalStyles.subTitle}>
                {confirmedScheduleCount}개
              </Text>
            </View>
          </View>

          {/* <Button title="라이딩 요청하기" onPress={() => navigation.navigate("ScheduleScreen")} /> */}
          <TouchableOpacity onPress={() => navigation.navigate("ScheduleScreen")} className="relative inline-block px-8 py-3 font-medium w-full max-w-md group flex items-center justify-center">
            <View className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-black group-hover:-translate-x-0 group-hover:-translate-y-0" />
            <View className="absolute inset-0 w-full h-full bg-white border-2 border-black group-hover:bg-black" />
            <Text className="relative text-lg text-black group-hover:text-white">+ 스케줄 추가</Text>
          </TouchableOpacity>
          
          {/* Guide Section */}
          <View className={globalStyles.shadowBox}>
            <Text className="text-lg font-bold text-gray-800 mb-2">📱 앱 사용 가이드</Text>
            <Text className="text-gray-600 mb-2">1. 👥 승객: 스케줄 등록 및 라이딩 요청하기</Text>
            <Text className="text-gray-600 ml-4 mb-1">• 홈 화면의 '라이딩 요청하기' 버튼을 눌러 새로운 스케줄을 등록합니다</Text>
            <Text className="text-gray-600 ml-4 mb-1">• 출발지, 도착지, 날짜, 시간 등을 입력합니다</Text>
            <Text className="text-gray-600 ml-4 mb-2">• 등록된 스케줄은 '내 스케줄' 탭에서 확인할 수 있습니다</Text>
            
            <Text className="text-gray-600 mb-2">2. 🚗 기사: 스케줄 찾기</Text>
            <Text className="text-gray-600 ml-4 mb-1">• List 화면에서 등록된 스케줄을 확인합니다</Text>
            <Text className="text-gray-600 ml-4 mb-1">• 스케줄을 선택하여 상세 정보를 확인합니다</Text>
            <Text className="text-gray-600 ml-4 mb-2">• '기사 요청' 버튼을 눌러 라이딩 기사로 등록합니다</Text>
            
            <Text className="text-gray-600 mb-2">3. ✅ 승인 및 확정</Text>
            <Text className="text-gray-600 ml-4 mb-1">• 승객은 기사 요청을 확인하고 원하는 기사의 버튼을 눌러 승인할 수 있습니다.</Text>
            <Text className="text-gray-600 ml-4 mb-1">• 승객이 기사를 승인하면 해당 기사의 연락처가 상세화면에 업데이트 되고 연락할 수 있습니다.</Text>
            <Text className="text-gray-600 ml-4">• 확정된 스케줄은 '내 스케줄' 탭에서 관리됩니다</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;