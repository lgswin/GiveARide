import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert, Image } from "react-native";
import { auth, db } from "../src/firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import globalStyles from "../styles/globalStyles";

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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      <View className={globalStyles.backContainer}>
        <View className={globalStyles.centeredContainer}>
          {!user ? (
            <>
              <Text className="text-lg text-red-500">로그인이 필요합니다.</Text>
            </>
          ) : (
            <>
              <View className="flex-row items-center">
                {profileImage && (
                  <Image source={{ uri: profileImage }} style={{ width: 100, height: 100, borderRadius: 50, marginRight: 10 }} />
                )}
                <View>
                  <Text className={globalStyles.leftMarginBig}>{user.displayName || "사용자"}!</Text>
                  <Text className={globalStyles.leftMarginText}>{nickname}</Text>
                </View>
              </View>
              <View className={globalStyles.shadowBox}>
                <View className="items-center">
                  <Text className={globalStyles.listText}>{user.email}</Text>
                  <Text className={globalStyles.listText}>{phoneNumber}</Text>
                  <Text className={globalStyles.listText}>등록한 스케줄: {scheduleCount}개</Text>
                </View>
              </View>
              <Button title="로그아웃" onPress={handleLogout} />
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;