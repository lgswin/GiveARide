import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, ScrollView, TouchableOpacity } from "react-native";
import { collection, getDocs, Timestamp, query, orderBy, where, getDoc, doc } from "firebase/firestore";
import { db, auth } from "../src/firebaseConfig";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import globalStyles from "../styles/globalStyles";

const MyListScreen: React.FC = () => {
  const [schedules, setSchedules] = useState<any[]>([]);
  const navigation = useNavigation();

  const handleItemPress = (item: any) => {
    navigation.navigate("MyDetailScreen", { schedule: item });
  };

  useFocusEffect(
    useCallback(() => {
      const fetchSchedules = async () => {
        try {
          if (!auth.currentUser) {
            console.error("사용자가 로그인되지 않았습니다.");
            return;
          }

          const userRef = doc(db, "users", auth.currentUser.uid);
          const userDoc = await getDoc(userRef);
          let isDriver = false;

          if (userDoc.exists()) {
            isDriver = userDoc.data().driver || false;
          }

          const schedulesCollection = collection(db, "schedules");
          let schedulesQuery;

          if (isDriver) {
            schedulesQuery = query(
              schedulesCollection,
              where("riders", "array-contains", auth.currentUser.uid), // Show schedules where the user is a requested driver
              orderBy("createdAt", "desc")
            );
          } else {
            schedulesQuery = query(
              schedulesCollection,
              where("userEmail", "==", auth.currentUser.email), // Show schedules created by the user
              orderBy("createdAt", "desc")
            );
          }

          const scheduleSnapshot = await getDocs(schedulesQuery);
          const scheduleList = await Promise.all(scheduleSnapshot.docs.map(async (doc) => {
            const data = doc.data();
            let formattedDate = "날짜 없음";
            if (data.date instanceof Timestamp) {
              formattedDate = data.date.toDate().toLocaleString();
            } else if (typeof data.date === "string") {
              formattedDate = new Date(data.date).toLocaleString();
            }
            let formattedCreatedAt = "등록 시간 없음";
            if (data.createdAt instanceof Timestamp) {
              formattedCreatedAt = data.createdAt.toDate().toLocaleString();
            } else if (typeof data.createdAt === "string") {
              formattedCreatedAt = new Date(data.createdAt).toLocaleString();
            }

            return {
              id: doc.id,
              ...data,
              date: formattedDate,
              createdAt: formattedCreatedAt,
            };
          }));

          setSchedules(scheduleList);
        } catch (error: any) {
          console.error("스케줄 불러오기 오류:", error.message);
        }
      };

      fetchSchedules();
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      <View className={globalStyles.backContainer}>
        <View className={globalStyles.centeredContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("ScheduleScreen")} className="relative inline-block px-8 py-3 font-medium w-full max-w-md group flex items-center justify-center">
            <View className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-black group-hover:-translate-x-0 group-hover:-translate-y-0" />
            <View className="absolute inset-0 w-full h-full bg-white border-2 border-black group-hover:bg-black" />
            <Text className="relative text-lg text-black group-hover:text-white">+ 스케줄 추가</Text>
          </TouchableOpacity>
          <View  style={{ flex: 1 }} className={globalStyles.listContainer}>
            {schedules.length > 0 ? (
              <FlatList
                data={schedules}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleItemPress(item)}>
                    <View className={globalStyles.listItem}>
                      <Text className={globalStyles.listText}>
                        {item.departure} → {item.destination} {item.confirmed === "pending" ? "⏳" : item.confirmed==="yes" ? "✅" : "❓"}
                      </Text>
                      <Text className="text-sm text-gray-600">출발시간: {item.date}</Text>
                      <Text className="text-xs text-gray-500">등록 시간: {item.createdAt}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={true}
              />
            ) : (
              <Text className={globalStyles.listText}>등록된 스케줄이 없습니다.</Text>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MyListScreen;