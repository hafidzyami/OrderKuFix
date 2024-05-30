import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  TouchableOpacity,
  Button,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign, Entypo } from "@expo/vector-icons";

const CustomerHome = () => {
  const [UMKM, setUMKM] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [favUMKM, setFavUMKM] = useState<any>();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  const fetchUMKM = async () => {
    try {
      const db = getFirestore();
      const umkmCollection = collection(db, "umkm");
      const snapshot = await getDocs(umkmCollection);
      const documentData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUMKM(documentData);
      const docRef = doc(
        getFirestore(),
        "customer",
        getAuth().currentUser!!.uid
      );
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFavUMKM(docSnap.data().favUMKM);
      }
      setLoading(false);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUMKM();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchUMKM();
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      router.push("../afterLanding");
    } catch (error: any) {
      alert("Error logging out: " + error.message);
    }
  };

  const renderUMKMCard = ({ item }: any) => (
    <TouchableOpacity
      onPress={() =>
        router.replace({ pathname: "../(UMKM)/ListMenu", params: item })
      }
      className=""
    >
      <View className="bg-white my-2 rounded-lg w-36 shadow-sm shadow-black">
        <Image
          className="w-full rounded-t-lg h-32"
          source={{ uri: item.photoURL || "" }}
        />
        <Text className="my-2 mx-2 font-semibold h-10 text-sm">
          {item.nama}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderHorizontalUMKM = (data: any) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="">
      {data.map((item: any) => (
        <View key={item.id} className="ml-6">
          {renderUMKMCard({ item })}
        </View>
      ))}
      <View className="w-6" />
    </ScrollView>
  );

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      className="bg-white h-full"
    >
      <LinearGradient
        colors={["#fffab3", "#FFF676", "#F8E800"]}
        className="bg-yellow-200 rounded-b-xl relative h-64 shadow-sm shadow-black"
      >
        <Text className="z-10 mt-36 mx-6 absolute font-extrabold text-4xl">
          Delicious{"\n"}food for you
        </Text>
        <Image
          source={require("./assets-customer/food-background.png")}
          className="w-full h-64 rounded-b-xl z-0"
        />
        <View className="absolute top-12 right-4">
          <Entypo
            name="log-out"
            size={26}
            color="black"
            onPress={() => setModalVisible(true)}
          />
        </View>
      </LinearGradient>
      {loading ? (
        <ActivityIndicator size={60} color="#F8E800" className="mt-28" />
      ) : (
        <SafeAreaView>
          <View className="-mt-2 ">
            <Pressable
              onPress={() =>
                router.replace({
                  pathname: "/(UMKM)/ListUMKM",
                  params: { isFavorite: "false" },
                })
              }
              className="w-[30%] mx-6 flex flex-row justify-between items-center pr-2 rounded-lg "
            >
              <Text className="text-lg text-textButton font-bold">Near Me</Text>
              <AntDesign name="right" size={18} color="black" />
            </Pressable>
            <View style={{ height: 200 }}>{renderHorizontalUMKM(UMKM)}</View>
            <Pressable
              onPress={() =>
                router.replace({
                  pathname: "/(UMKM)/ListUMKM",
                  params: { isFavorite: "true" },
                })
              }
              className="w-[30%] mx-6 flex flex-row justify-between items-center pr-2 rounded-lg mt-4"
            >
              <Text className="text-lg text-textButton font-bold -mt-1">
                Favorite
              </Text>
              <AntDesign name="right" size={18} color="black" />
            </Pressable>
            <View style={{ height: 200 }} className="mb-10">
              {renderHorizontalUMKM(
                UMKM.filter((item: any) => favUMKM && favUMKM.includes(item.id))
              )}
            </View>
          </View>
        </SafeAreaView>
      )}
      <View className="flex items-center mb-6 mt-2">
        <Text className="font-semibold">
          Developed by Hafidz, Dastin, Daniel
        </Text>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sign Out</Text>
            <Text style={styles.modalMessage}>Are you sure to sign out?</Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.button, styles.buttonYes]}
                onPress={handleLogout}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonNo]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>No</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 320,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    width: "100%",
  },
  button: {
    // padding: 10,
    // borderRadius: 5,
    // minWidth: 100,
    // alignItems: "center",

    padding: 10,
    borderRadius: 5,

    minWidth: 100,
    alignItems: "center",
  },
  buttonYes: {
    backgroundColor: "#FFF676",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonNo: {
    backgroundColor: "#FFFFFF",
    shadowColor: "gray",
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    color: "black",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default CustomerHome;
