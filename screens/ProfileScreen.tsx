import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert, Image } from "react-native";
import { auth, db } from "../src/firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";

const styles = {
  container: "flex-1 items-center justify-start bg-gray-100 pt-20",
  title: "text-3xl font-bold text-red-800 mb-6",
  authContainer: "w-full max-w-md p-5 rounded-lg mb-6 border border-20",
  authTitle: "text-xl font-bold text-center text-gray-700 mb-4",
  input: "w-full h-12 border border-gray-300 rounded-lg px-4 mb-3",
  buttonContainer: "w-full max-w-md p-5 bg-white rounded-lg shadow-md",
  userContainer: "w-full max-w-md p-5 bg-white rounded-lg shadow-md items-center mb-10",
  userName: "text-3xl font-bold text-gray-800 ml-4", // Larger, bold, with left margin
  userNick: "text-xl text-gray-600 ml-4", // Smaller, with left margin
};

const ProfileScreen = ({ navigation }: any) => {
  const [user, setUser] = useState<any>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [scheduleCount, setScheduleCount] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setProfileImage(currentUser.photoURL || null);

        // Fetch user details from Firestore
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setPhoneNumber(userDoc.data().phoneNumber || "전화번호 없음");
          setNickname(userDoc.data().nickname || "닉네임 없음");
          setProfileImage(userDoc.data().profileImage || currentUser.photoURL || null);
        }

        // Listen for real-time updates on the count of schedules created by the user
        const schedulesCollection = collection(db, "schedules");
        const schedulesQuery = query(schedulesCollection, where("userEmail", "==", currentUser.email));

        const unsubscribeSchedules = onSnapshot(schedulesQuery, (snapshot) => {
          setScheduleCount(snapshot.size);
        });

        return () => unsubscribeSchedules();
      } else {
        setUser(null);
        setPhoneNumber("");
        setNickname("");
        setProfileImage(null);
        setScheduleCount(0);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("로그아웃 완료", "다시 로그인해주세요.");
    } catch (error: any) {
      console.error("로그아웃 오류:", error.message);
    }
  };

  return (
    <View className={styles.container}>
      {!user ? (
        <>
          <Text className="text-lg text-red-500">로그인이 필요합니다.</Text>
        </>
      ) : (
        <>
          <View className="flex-row items-center mb-4">
            {profileImage && (
              <Image source={{ uri: profileImage }} style={{ width: 100, height: 100, borderRadius: 50, marginRight: 10 }} />
            )}
            <View>
              <Text className={styles.userName}>{user.displayName || "사용자"}!</Text>
              <Text className={styles.userNick}>{nickname}</Text>
            </View>
          </View>
          <View className={styles.userContainer}>
            <Text className="text-lg">{user.email}</Text>
            <Text className="text-lg">{phoneNumber}</Text>
            <Text className="text-lg">등록한 스케줄: {scheduleCount}개</Text>
          </View>
          <Button title="로그아웃" onPress={handleLogout} />
        </>
      )}
    </View>
  );
};

export default ProfileScreen;