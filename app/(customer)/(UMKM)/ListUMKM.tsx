import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  ActivityIndicator,
  Button,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { router, useLocalSearchParams } from "expo-router";
import { getAuth } from "firebase/auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LoveButton from "@/components/LoveButton";

const ListUMKM = () => {
  // pengen pake params tapi gabisa
  // const params = useLocalSearchParams();
  const [UMKM, setUMKM] = useState<any>();
  const [favUMKM, setFavUMKM] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const params = useLocalSearchParams();
  var isFavorite = params.isFavorite;

  useEffect(() => {
    const fetchData = async () => {
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
    fetchData();
  }, []);

  const renderUMKMCard = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => router.push({pathname : '/ListMenu', params : item})}>
      <View style={styles.card}>
        <Image style={styles.image} source={{ uri: item.photoURL || "" }} />
        <Text style={styles.name}>{item.nama}</Text>
        <LoveButton
          isLoved={favUMKM && favUMKM.includes(item.id)}
          onPress={() => handleFav(item.id)}
        />
      </View>
    </TouchableOpacity>
  );

  const handleFav = async (id: string) => {
    if (favUMKM) {
      if (!favUMKM.includes(id)) {
        await updateDoc(
          doc(getFirestore(), "customer", getAuth().currentUser!!.uid),
          {
            favUMKM: arrayUnion(id),
          }
        );
        setFavUMKM([...favUMKM, id]);
        alert(`Berhasil menambahkan ke dalam favorit!`);
      } else {
        await updateDoc(
          doc(getFirestore(), "customer", getAuth().currentUser!!.uid),
          {
            favUMKM: arrayRemove(id),
          }
        );
        setFavUMKM(favUMKM.filter((favId: string) => favId !== id));
        alert(`Berhasil menghapus dari dalam favorit!`);
      }
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#F8E800" />
      ) : (
        <View>
          <ScrollView>
            <FlatList
              data={
                isFavorite == "true"
                  ? UMKM.filter((item: any) => favUMKM.includes(item.id))
                  : UMKM
              }
              renderItem={renderUMKMCard}
              keyExtractor={(item) => item.id}
              nestedScrollEnabled={true}
              scrollEnabled={false}
            />
          </ScrollView>
        </View>
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

export default ListUMKM;
