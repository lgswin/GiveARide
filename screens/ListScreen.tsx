import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, ScrollView, TouchableOpacity } from "react-native";
import { collection, getDocs, Timestamp, query, orderBy } from "firebase/firestore";
import { db } from "../src/firebaseConfig";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import globalStyles from "../styles/globalStyles";

// const styles = {
//   backContainer: "flex-1 bg-gray-100 p-6 mt-4",
//   centeredContainer: "items-center bg-gray-100 p-6",
//   bigTitle: "text-3xl font-bold text-blue-800 mb-6",
//   listContainer: "w-full max-w-md p-5 bg-white rounded-lg shadow-md flex-grow overflow-auto",
//   listItem: "p-4 border-b border-gray-300",
//   listText: "text-lg text-gray-800",
// };

const ListScreen: React.FC = () => {
  const [schedules, setSchedules] = useState<any[]>([]);
  const navigation = useNavigation();

  const handleItemPress = (item: any) => {
    navigation.navigate("DetailScreen", { schedule: item });
  };

  useFocusEffect(
    useCallback(() => {
      const fetchSchedules = async () => {
        try {
          const schedulesCollection = collection(db, "schedules");
          const schedulesQuery = query(schedulesCollection, orderBy("createdAt", "desc"));
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

            // Fetch user nickname from Firestore
            let nickname = "알 수 없음";
            if (data.userEmail) {
              const userDoc = await getDocs(collection(db, "users"));
              const user = userDoc.docs.find(user => user.data().email === data.userEmail);
              if (user) {
                nickname = user.data().nickname || "알 수 없음";
              }
            }

            return {
              id: doc.id,
              ...data,
              date: formattedDate,
              createdAt: formattedCreatedAt,
              nickname,
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
<SafeAreaView style={{ flex: 1 }}>
  <View style={{ flex: 1 }}>
      <View className={globalStyles.backContainer}>
        <View style={{ flex: 1 }} className={globalStyles.centeredContainer}>
          <Text className={globalStyles.bigTitle}>🚖 등록된 스케줄 🚖</Text>
          {/* <View className={globalStyles.scrollWrapper}> */}
              <View style={{ flex: 1 }} className={globalStyles.listContainer}>
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
                        <Text className="text-sm text-gray-600">등록자: {item.nickname}</Text>
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
          {/* </View> */}
        </View>
      </View>
    </View>
</SafeAreaView>
  );
};

export default ListScreen;