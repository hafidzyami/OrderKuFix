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
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import formatRupiah from "@/functions/formatRupiah";

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
      onPress={() =>
        router.push({ pathname: `../EditMenu`, params: item })
      }
    >
      <View style={styles.card}>
        {loadingImage && <ActivityIndicator size="large" color="#F8E800" />}
        <Image
          style={styles.image}
          source={{ uri: item.imageURL }}
          onLoadStart={() => setLoadingImage(true)}
          onLoadEnd={() => setLoadingImage(false)}
        />
        <Text style={styles.name}>{item.foodName}</Text>
        <Text style={styles.name}>
          {item.isAvailable ? "Available" : "Out of Stock"}
        </Text>
        <Text style={styles.name}>Rp {formatRupiah(item.price)}</Text>
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
          <ButtonCustom
            onPress={() => router.replace("/AddMenu")}
            title="Add Menu"
            color="#F8E800"
            opacity={1}
          ></ButtonCustom>
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
    alignItems: "center",
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
