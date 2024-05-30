import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatList from "../../components/ChatList";
import { getAuth } from "firebase/auth";

const chat = () => {
  const [users, setUsers] = useState<any>();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [daftarChat, setDaftarChat] = useState<any>();

  const onRefresh = () => {
    setRefreshing(true);
    fetchDaftarChat()
    setRefreshing(false);
  };

  const fetchDaftarChat = async () => {
    try {
      const customerDocRef = doc(
        getFirestore(),
        "customer",
        getAuth().currentUser!!.uid
      );
      const customerDocSnap = await getDoc(customerDocRef);

      if (customerDocSnap.exists()) {
        const customerData = customerDocSnap.data();
        const daftarChat = customerData.daftarChat;
        setDaftarChat(daftarChat);
        try {
          const paramedisRef = collection(getFirestore(), "umkm"); // Reference to the Firestore collection
          const snapshot = await getDocs(paramedisRef); // Get all documents from the collection
          const documentData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUsers(documentData.filter((user) => daftarChat.includes(user.id)));
        } catch (error) {
          console.error("Error fetching documents: ", error);
        }
      } else {
        console.log("No such document!");
        setDaftarChat([]);
      }
    } catch (error) {
      console.error("Error fetching daftarChat:", error);
      setDaftarChat([]);
    }
  };

  useEffect(() => {
    fetchDaftarChat();
  }, []);

  return (
    <View className="ml-6">
      <Text className="font-bold text-lg mb-3 mt-5"> Daftar UMKM : </Text>
      {users ? (
        <SafeAreaView style={{ marginTop : -40 }}>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {users && <ChatList users={users} />}
          </ScrollView>
        </SafeAreaView>
      ) : (
        <View>
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
};

export default chat;
