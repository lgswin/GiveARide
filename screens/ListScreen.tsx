import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Alert } from "react-native";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../src/firebaseConfig";

const styles = {
  container: "flex-1 items-center justify-start bg-gray-100 pt-20",
  title: "text-3xl font-bold text-blue-800 mb-6",
  listContainer: "w-full max-w-md p-5 bg-white rounded-lg shadow-md",
  listItem: "p-4 border-b border-gray-300",
  listText: "text-lg text-gray-800",
};

const ListScreen: React.FC = () => {
  const [schedules, setSchedules] = useState<any[]>([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const schedulesCollection = collection(db, "schedules");
        const scheduleSnapshot = await getDocs(schedulesCollection);
        const scheduleList = scheduleSnapshot.docs.map(doc => {
          const data = doc.data();
          let formattedDate = "날짜 없음";
          if (data.date instanceof Timestamp) {
            formattedDate = data.date.toDate().toLocaleString();
          } else if (typeof data.date === "string") {
            formattedDate = new Date(data.date).toLocaleString();
          }

          return {
            id: doc.id,
            ...data,
            date: formattedDate,
          };
        });
        setSchedules(scheduleList);
      } catch (error: any) {
        console.error("스케줄 불러오기 오류:", error.message);
        Alert.alert("불러오기 실패", "스케줄을 가져오는 중 오류가 발생했습니다.");
      }
    };

    fetchSchedules();
  }, []);

  return (
    <View className={styles.container}>
      <Text className={styles.title}>🚖 등록된 스케줄 🚖</Text>
      <View className={styles.listContainer}>
        {schedules.length > 0 ? (
          <FlatList
            data={schedules}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className={styles.listItem}>
                <Text className={styles.listText}>
                  {item.departure} → {item.destination} ({item.date})
                </Text>
                <Text className="text-sm text-gray-600">등록자: {item.userEmail}</Text>
              </View>
            )}
          />
        ) : (
          <Text className="text-lg text-gray-500 text-center">등록된 스케줄이 없습니다.</Text>
        )}
      </View>
    </View>
  );
};

export default ListScreen;