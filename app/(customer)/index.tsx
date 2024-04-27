import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  TouchableOpacity,
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
      onPress={() => router.push({ pathname: "../(UMKM)/ListMenu", params: item })}
    >
      <View style={styles.card}>
        <Image style={styles.image} source={{ uri: item.photoURL || "" }} />
        <Text style={styles.name}>{item.nama}</Text>
      </View>
    </TouchableOpacity>
  );
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
            <Button
              title="Near Me"
              onPress={() =>
                router.replace({
                  pathname: "/(UMKM)/ListUMKM",
                  params: { isFavorite: false },
                })
              }
            ></Button>
            <View style={{ height: 150 }}>
              <ScrollView horizontal={true}>
                <FlatList
                  data={UMKM}
                  renderItem={renderUMKMCard}
                  keyExtractor={(item) => item.id}
                  horizontal={true}
                  nestedScrollEnabled={true}
                  scrollEnabled={false}
                />
              </ScrollView>
            </View>
            <Button
              title="Favorite"
              onPress={() =>
                router.replace({
                  pathname: "/(UMKM)/ListUMKM",
                  params: { isFavorite: true },
                })
              }
            ></Button>
            <View style={{ height: 150 }}>
              <ScrollView horizontal={true}>
                <FlatList
                  data={UMKM.filter(
                    (item: any) => favUMKM && favUMKM.includes(item.id)
                  )}
                  renderItem={renderUMKMCard}
                  keyExtractor={(item) => item.id}
                  horizontal={true}
                  nestedScrollEnabled={true}
                  scrollEnabled={false}
                />
              </ScrollView>
            </View>
            <Button
              title="Sign Out"
              onPress={() => signOut(getAuth())}
            ></Button>
          </ScrollView>
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
});

export default CustomerHome;
