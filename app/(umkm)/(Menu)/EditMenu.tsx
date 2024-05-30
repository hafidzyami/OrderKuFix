import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ButtonCustom } from "@/components/Button";
import { router } from "expo-router";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import formatRupiah from "@/functions/formatRupiah";
import { Feather } from "@expo/vector-icons";

const EditMenu = () => {
  const [menu, setMenu] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loadingImage, setLoadingImage] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      const docRef = doc(getFirestore(), "menu", getAuth().currentUser!!.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setMenu(docSnap.data().menus);
      } else {
        setMenu([]);
      }
    } catch (error) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderMenuCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => router.push({ pathname: `./UpdateMenu`, params: item })}
    >
      <View className="flex border-gray-400 border-t-[1px]">
        <View className="flex flex-row rounded-lg my-5 mx-5">
          <Image
            width={90}
            height={90}
            borderRadius={8}
            source={{ uri: item.imageURL || "" }}
            onLoadStart={() => setLoadingImage(true)}
            onLoadEnd={() => setLoadingImage(false)}
          />
          <View className="flex flex-row ml-4 justify-between w-[55%]">
            <View className="">
              <Text className="text-lg font-bold">{item.foodName}</Text>
              <Text className="text-sm">Rp {formatRupiah(item.price)}</Text>
              <Text className="text-sm">{item.deskripsi}</Text>
            </View>
          </View>
          <View className="mt-1">
            <Text style={{ color: item.isAvailable ? "green" : "red" }}>
              {item.isAvailable ? "Available" : "Out of\nStock"}
            </Text>
            <View className="mt-1">
              <Feather name="edit" size={24} color="black" />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#F8E800" />
      ) : (
        <SafeAreaView>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <FlatList
              data={menu}
              renderItem={renderMenuCard}
              keyExtractor={(item) => item.idMenu}
              nestedScrollEnabled={true}
              scrollEnabled={false}
            />
          </ScrollView>
          <View style={{ marginBottom: 10 }}>
            <ButtonCustom
              onPress={() => router.replace("/AddMenu")}
              title="Add New Menu"
              color="#F8E800"
              opacity={1}
            ></ButtonCustom>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  card: {
    margin: 10,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  image: {
    width: 100,
    height: 100,
  },
  name: {
    marginTop: 5,
    fontSize: 16,
  },
  loveButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  loveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default EditMenu;
