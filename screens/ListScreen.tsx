import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, ScrollView, TouchableOpacity } from "react-native";
import { collection, getDocs, Timestamp, query, orderBy } from "firebase/firestore";
import { db } from "../src/firebaseConfig";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
// import DetailScreen from './DetailScreen';

const styles = {
  container: "flex-1 items-center justify-start bg-gray-100 pt-20",
  title: "text-3xl font-bold text-blue-800 mb-6",
  listContainer: "w-full max-w-md p-5 bg-white rounded-lg shadow-md flex-grow overflow-auto",
  listItem: "p-4 border-b border-gray-300",
  listText: "text-lg text-gray-800",
};

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
    <View className={styles.container}>
      <Text className={styles.title}>🚖 등록된 스케줄 🚖</Text>
      <View className="w-full max-w-md flex-1" style={{ overflowY: "auto" }}>
        <View className={styles.listContainer}>
          {schedules.length > 0 ? (
            <FlatList
              data={schedules}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleItemPress(item)}>
                  <View className={styles.listItem}>
                    <Text className={styles.listText}>
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
            <Text className="text-lg text-gray-500 text-center">등록된 스케줄이 없습니다.</Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default ListScreen;