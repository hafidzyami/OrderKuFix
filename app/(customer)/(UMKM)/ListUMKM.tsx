import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  ActivityIndicator,
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
import LoveButton from "@/components/LoveButton";
import { Ionicons } from "@expo/vector-icons";

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
    <TouchableOpacity
      onPress={() => router.push({ pathname: "/ListMenu", params: item })}
    >
      <View className="flex border-gray-400 border-t-[1px]">
        <View className="flex flex-row  rounded-lg my-5 mx-5">
          <Image
            width={90}
            height={90}
            borderRadius={8}
            source={{ uri: item.photoURL || "" }}
          />
          <View className="flex flex-row ml-4 justify-between w-[70%]">
            <View className="">
              <Text className="text-lg font-bold">{item.nama}</Text>
              <View className="flex flex-row items-center ">
                <Ionicons name="location-outline" size={18} color="black" />
                <Text className="text-sm ml-1">Kota Bandung</Text>
              </View>
              
            </View>

            <View className="">
              <LoveButton
                isLoved={favUMKM && favUMKM.includes(item.id)}
                onPress={() => handleFav(item.id)}
              />
            </View>
          </View>
        </View>
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
    <View className="bg-white flex-1">
      {loading ? (
        <ActivityIndicator size={60} color="#F8E800" className="flex justify-center items-center h-full"/>
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
              className=""
            />
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default ListUMKM;
