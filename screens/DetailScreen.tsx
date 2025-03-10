import React from "react";
import { View, Text, Button } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const styles = {
  container: "flex-1 items-center justify-center bg-gray-100 p-6",
  title: "text-2xl font-bold text-gray-800 mb-6",
  detailContainer: "border border-gray-400 p-4 bg-white rounded-lg w-full max-w-md mb-6",
  row: "flex flex-row border-b border-gray-300 py-2",
  lastrow: "flex flex-row py-2",
  label: "text-lg font-semibold text-gray-700 w-1/3", // Fixed width for alignment
  value: "text-lg text-gray-700 flex-1", // Fill remaining space
};

const DetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { schedule } = route.params as { schedule: any };

  return (
    <View className={styles.container}>
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
          <Text className={styles.value}>{schedule.confirmed ? "확정" : "미확정"}</Text>
        </View>
      </View>
      <Button title="뒤로 가기" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default DetailScreen;