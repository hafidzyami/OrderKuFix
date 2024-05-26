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
import { AntDesign } from "@expo/vector-icons";

const CustomerHome = () => {
  const [UMKM, setUMKM] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [favUMKM, setFavUMKM] = useState<any>();
  const [refreshing, setRefreshing] = useState<boolean>(false);

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
    } catch (error) {
      alert(error);
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

  const renderUMKMCard = ({ item }: any) => (
    <TouchableOpacity
      onPress={() =>
        router.push({ pathname: "../(UMKM)/ListMenu", params: item })
      }
      className=""
    >
      <View className="bg-white ml-6 my-2 rounded-lg w-36 shadow-sm shadow-black">
        <Image
          // style={styles.image}
          className="w-full rounded-t-lg h-32"
          source={{ uri: item.photoURL || "" }}
        />
        <Text className="my-2 mx-2 font-bold h-10">{item.nama}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderHorizontalUMKM = (data: any) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {data.map((item: any) => (
        <View key={item.id}>{renderUMKMCard({ item })}</View>
      ))}
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
            <View style={{ height: 200 }} >{renderHorizontalUMKM(UMKM)}</View>
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
          <View className="w-[90%] mx-6 mb-6">
            <Button title="Sign Out" onPress={() => signOut(getAuth())} />
          </View>
        </SafeAreaView>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 100,
  },
});

export default CustomerHome;
